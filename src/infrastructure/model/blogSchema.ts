import mongoose, { Schema } from "mongoose";
import { IBlog } from "../../entities/blogEntity";

const blog = new Schema<IBlog>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true })

export const Blog = mongoose.model<IBlog>('Blog', blog);
