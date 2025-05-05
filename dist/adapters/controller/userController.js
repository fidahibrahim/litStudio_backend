"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../../infrastructure/utils/cloudinary"));
class userController {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.addBlog = this.addBlog.bind(this);
        this.fetchUserBlogs = this.fetchUserBlogs.bind(this);
        this.listBlogs = this.listBlogs.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.getBlogById = this.getBlogById.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
    }
    async register(req, res, next) {
        try {
            const { name, email, password, } = req.body;
            const response = await this.userUseCase.register(name, email, password);
            if (!response.status) {
                res.status(401).json(response);
            }
            else {
                res.status(200).json(response);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const response = await this.userUseCase.login(email, password);
            if (!response.status) {
                res.status(401).json(response);
            }
            res.cookie('userToken', response.data.token, { httpOnly: true, maxAge: 3600000 });
            res.cookie('userRefreshToken', response.data.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            res.status(200).json({ status: true, message: response.message, data: response.data.user });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            res.cookie("userToken", "");
            res.cookie("userRefreshToken", "");
            res.status(200).json({ status: true, message: "User logout successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async addBlog(req, res, next) {
        try {
            const { title, content, tags, userId } = req.body;
            const image = req.file;
            let imageUrl = undefined;
            if (image) {
                const result = await cloudinary_1.default.uploader.upload(image.path, {
                    folder: 'blogs',
                    resource_type: 'image'
                });
                imageUrl = result.secure_url;
            }
            let parsedTags;
            if (typeof tags === 'string') {
                parsedTags = JSON.parse(tags);
            }
            else {
                parsedTags = tags;
            }
            const data = {
                title,
                content,
                tags: parsedTags,
                image: imageUrl,
                userId
            };
            const response = await this.userUseCase.addBlog(data);
            res.status(201).json({ message: "Blog created successfully", blog: response });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async fetchUserBlogs(req, res, next) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                res.status(400).json({ message: 'User ID is required' });
                return;
            }
            const response = await this.userUseCase.fetchUserBlogs(userId);
            res.status(200).json({
                success: true,
                data: response,
                message: 'Blogs fetched successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async listBlogs(req, res, next) {
        try {
            const response = await this.userUseCase.listBlogs();
            res.status(200).json({
                success: true,
                data: response,
                message: 'Blogs fetched successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteBlog(req, res, next) {
        try {
            const blogId = req.params.blogId;
            const response = await this.userUseCase.deleteBlog(blogId);
            res.status(200).json({ success: true, message: 'Blog deleted successfully', data: response });
        }
        catch (error) {
            next(error);
        }
    }
    async getBlogById(req, res, next) {
        try {
            const { blogId } = req.params;
            console.log(blogId);
            const blog = await this.userUseCase.getBlogById(blogId);
            res.status(200).json({
                success: true,
                data: blog
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateBlog(req, res, next) {
        try {
            const { title, content, tags, userId, blogId, keepExistingImage } = req.body;
            const parsedTags = tags ? JSON.parse(tags) : [];
            let imageData = null;
            const updateData = {
                blogId,
                userId,
                title,
                content,
                tags: parsedTags,
                image: req.file || null,
                keepExistingImage: keepExistingImage === 'true'
            };
            const updatedBlog = await this.userUseCase.updateBlog(updateData);
            res.status(200).json({
                status: true,
                message: 'Blog updated successfully',
                data: updatedBlog
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = userController;
