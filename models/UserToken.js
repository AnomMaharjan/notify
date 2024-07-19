import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserTokenSchema = new Schema({
    userId: {
        type:Schema.Types.ObjectId,
        required:true
    },
    token:{
        type: String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 30 * 8640
    }
}
)


const UserToken = mongoose.model("UserToken",UserTokenSchema);
export default UserToken;