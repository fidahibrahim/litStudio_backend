import mongoose from "mongoose";

export interface IBlog {
    _id?: String| mongoose.Types.ObjectId; 
    title: string;
    content: string;
    tags: string[];
    image?: string;
    userId: string | { _id: String; name: string; email: string }; 
    createdAt?: string;
}

export interface IBlogRes {
    _id?: String;
    title: string;
    content: string;
    userId?: {
        _id: string;
        name: string;
        email: string;
    };
    image?: string;
    createdAt?: string;
}