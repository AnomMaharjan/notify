import { Router } from "express";
import admin from 'firebase-admin';
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { config } from "dotenv";
const notificationRouter = Router();
config();



const { private_key } = JSON.parse(process.env.private_key)
// const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: String(process.env.client_email),
        privateKey: private_key,
        projectId: String(process.env.project_id)
    })
});



var registrationTokens = [];

notificationRouter.post('/send', auth, async (req, res) => {
    try {
        const notification = req.body;
        registrationTokens.push(notification.fcmToken)
        console.log(notification)
        const message = {
            data: {
                title: String(notification.title),
                body: String(notification.description),
                username: String(notification.username)
            },
            notification: {
                title: notification.title,
                body: notification.description
            },
            token: notification.fcmToken
        };

        const user = await User.findOne({ username: req.body.to })
        user.notifications.push(Notification(
            {
                title: notification.title,
                description: notification.description,
                from: notification.from
            }
        ))

        admin.messaging().send(message)
            .then((response) => {
                console.log('Notification sent:', response);
                user.save()
                return res.status(200).send({
                    status: true,
                    msg: "Notificaiton sent successfully."
                })
            })
            .catch((error) => {
                console.error('Error sending notification:', error);

                return res.status(500).send({
                    status: false,
                    msg: err
                })
            });
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .send({ error: true, message: "Internal Server Error." });
    }
})

notificationRouter.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const notifications = user.notifications;

        res.status(200).send({ success: true, notifications })
    } catch (err) {
        return res
            .status(500)
            .send({ error: true, message: "Internal Server Error." });
    }

})

export default notificationRouter;