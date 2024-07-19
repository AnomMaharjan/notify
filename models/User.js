import mongoose from "mongoose";
import { notificationSchema } from "./Notification.js";

const userSchema = mongoose.Schema({
    username: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    fcmToken: [{
        type: String
    }],
    notifications:
    {
        type: [notificationSchema]
    }

},
);

const User = mongoose.model('User', userSchema)

export default User
