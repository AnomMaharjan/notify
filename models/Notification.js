import mongoose from "mongoose";

export const notificationSchema = mongoose.Schema({
    title: {
        type: String, required: true
    },
    description: {
        type: String, required: true
    },
    from: {
        type: String, required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},
);

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
