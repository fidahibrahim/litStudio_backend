"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../infrastructure/utils/cloudinary"));
const fs_1 = __importDefault(require("fs"));
class userUseCase {
    constructor(userRepository, hashingService, jwtService) {
        this.userRepository = userRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
    }
    async register(name, email, password) {
        const userExists = await this.userRepository.checkEmailExists(email);
        if (userExists) {
            return {
                status: false,
                message: {
                    email: "User already exists with this email"
                }
            };
        }
        if (password) {
            password = await this.hashingService.hashing(password);
        }
        const user = await this.userRepository.createUser(name, email, password);
        return {
            status: true,
            message: "User created successfully",
            data: user
        };
    }
    async login(email, password) {
        const user = await this.userRepository.checkEmailExists(email);
        if (!user) {
            return {
                status: false,
                message: {
                    email: "User Not Found"
                }
            };
        }
        const status = await this.hashingService.compare(password, user.password);
        if (!status) {
            return {
                status: false,
                message: {
                    password: "Incorrect Password"
                }
            };
        }
        const payload = {
            id: user._id,
            name: user.name
        };
        const token = this.jwtService.generateToken(payload);
        const refreshToken = this.jwtService.generateRefreshToken(payload);
        return {
            status: true,
            message: "User Login Succesfully",
            data: { token, refreshToken, user }
        };
    }
    async addBlog(data) {
        const blog = await this.userRepository.createBlog(data);
        return blog;
    }
    async fetchUserBlogs(userId) {
        const blogs = await this.userRepository.findByUserId(userId);
        return blogs;
    }
    async listBlogs() {
        const blogs = await this.userRepository.listBlogs();
        return blogs;
    }
    async deleteBlog(blogId) {
        return this.userRepository.deleteBlog(blogId);
    }
    async getBlogById(blogId) {
        const blog = await this.userRepository.getBlogById(blogId);
        return blog;
    }
    async updateBlog(blogData) {
        try {
            console.log(blogData, 'blogdata i get');
            const existingBlog = await this.userRepository.getBlogById(blogData.blogId);
            console.log(existingBlog, 'existing blog i get');
            if (!existingBlog) {
                throw new Error('Blog not found');
            }
            let existingUserId;
            if (typeof existingBlog.userId === 'string') {
                existingUserId = existingBlog.userId;
            }
            else {
                existingUserId = existingBlog.userId._id;
            }
            if (existingUserId.toString() !== blogData.userId) {
                throw new Error('Unauthorized: You cannot update this blog');
            }
            let imageUrl = existingBlog.image;
            if (blogData.image) {
                try {
                    const uploadImg = await cloudinary_1.default.uploader.upload(blogData.image.path, {
                        folder: 'blogs',
                        resource_type: 'image'
                    });
                    imageUrl = uploadImg.secure_url;
                    fs_1.default.unlinkSync(blogData.image.path);
                }
                catch (error) {
                    console.error('Error uploading image:', error);
                    throw new Error('Failed to upload image');
                }
            }
            else if (!blogData.keepExistingImage) {
                imageUrl = null;
            }
            const updateData = {
                title: blogData.title,
                content: blogData.content,
                tags: blogData.tags,
                updatedAt: new Date(),
            };
            if (blogData.image || !blogData.keepExistingImage) {
                updateData['image'] = imageUrl;
            }
            const updatedBlog = await this.userRepository.updateBlog(blogData.blogId, updateData);
            return updatedBlog;
        }
        catch (error) {
            console.error('Error in updateBlog usecase:', error);
            throw error;
        }
    }
}
exports.default = userUseCase;
