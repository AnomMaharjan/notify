import { Router } from "express";
import admin from 'firebase-admin';
import serviceAccount from '../notify-7a166-firebase-adminsdk-p18gx-3d6826dceb.json' assert { type: 'json' }
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const notificationRouter = Router();



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


// const registrationTokens = ['duvFrc5rROepQDEvUXbwrA:APA91bHumc25JC8XVyhJ4td_u4OUhSm3-UMdFZviKq5t-xLaiH-HKkrERqBMo3k9bLphEClwKp0Xz6X2PDq2BGe1OzMCSJ_MExVoW9evPS2GxBKmhYEHvESmGuldanLQGlnGqwNdWW6A'];

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
                res.send({
                    status: true,
                    msg: "Notificaiton sent successfully."
                })
            })
            .catch((error) => {
                console.error('Error sending notification:', error);

                res.send({
                    status: false,
                    msg: "Error sending notificaiton."
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