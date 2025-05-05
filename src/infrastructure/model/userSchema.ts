import mongoose, { Schema } from "mongoose";
import { IUser } from "../../entities/userEntity";

const user = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const userSchema = mongoose.model<IUser>('User', user)
export default userSchema