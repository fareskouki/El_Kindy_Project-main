import mongoose from "mongoose";

const contactSchema = mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    readNotificationsCount: {
        type: Number,
        default: 0, // Par défaut, le nombre de notifications lues est 0
    },
    unreadNotificationsCount: {
        type: Number,
        default: 0, // Par défaut, le nombre de notifications non lues est 0
    },
    isAdminRead: {
        type: Boolean,
        default: false, // Par défaut, la notification n'est pas lue par l'admin
    },
},
    { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
