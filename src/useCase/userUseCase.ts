import { IBlog, IBlogRes } from "../entities/blogEntity";
import cloudinary from "../infrastructure/utils/cloudinary";
import IHashingService from "../interface/IHashingService";
import IJwtService from "../interface/IJwtService";
import IUserRepository from "../interface/IUserRepository";
import IUserUseCase, { BlogUpdateData, UpdateBlog } from "../interface/IUserUseCase";
import fs from 'fs';

class userUseCase implements IUserUseCase {
    private userRepository: IUserRepository
    private hashingService: IHashingService
    private jwtService: IJwtService

    constructor(
        userRepository: IUserRepository,
        hashingService: IHashingService,
        jwtService: IJwtService,

    ) {
        this.userRepository = userRepository
        this.hashingService = hashingService
        this.jwtService = jwtService
    }

    async register(name: string, email: string, password: string) {
        const userExists = await this.userRepository.checkEmailExists(email)
        if (userExists) {
            return {
                status: false,
                message: {
                    email: "User already exists with this email"
                }
            }
        }
        if (password) {
            password = await this.hashingService.hashing(password)
        }
        const user = await this.userRepository.createUser(name, email, password)
        return {
            status: true,
            message: "User created successfully",
            data: user
        }
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.checkEmailExists(email)
        if (!user) {
            return {
                status: false,
                message: {
                    email: "User Not Found"
                }
            }
        }
        const status = await this.hashingService.compare(password, user.password)
        if (!status) {
            return {
                status: false,
                message: {
                    password: "Incorrect Password"
                }
            }
        }
        const payload = {
            id: user._id,
            name: user.name
        }
        const token = this.jwtService.generateToken(payload)
        const refreshToken = this.jwtService.generateRefreshToken(payload)
        return {
            status: true,
            message: "User Login Succesfully",
            data: { token, refreshToken, user }
        }
    }
    async addBlog(data: IBlog) {
        const blog = await this.userRepository.createBlog(data)
        return blog
    }

    async fetchUserBlogs(userId: string) {
        const blogs = await this.userRepository.findByUserId(userId)
        return blogs
    }

    async listBlogs() {
        const blogs = await this.userRepository.listBlogs()
        return blogs
    }

    async deleteBlog(blogId: string) {
        return this.userRepository.deleteBlog(blogId)
    }

    async getBlogById(blogId: string) {
        const blog = await this.userRepository.getBlogById(blogId)
        return blog
    }

    async updateBlog(blogData: UpdateBlog) {
        try {
            console.log(blogData, 'blogdata i get')
            const existingBlog = await this.userRepository.getBlogById(blogData.blogId)
            console.log(existingBlog, 'existing blog i get')
            if (!existingBlog) {
                throw new Error('Blog not found');
            }
            let existingUserId: String;

            if (typeof existingBlog.userId === 'string') {
                existingUserId = existingBlog.userId;
            } else {
                existingUserId = existingBlog.userId._id;
            }
            if (existingUserId.toString() !== blogData.userId) {
                throw new Error('Unauthorized: You cannot update this blog');
            }
            let imageUrl: string | null | undefined = existingBlog.image;
            if (blogData.image) {
                try {
                    const uploadImg = await cloudinary.uploader.upload(blogData.image.path, {
                        folder: 'blogs',
                        resource_type: 'image'
                    })
                    imageUrl = uploadImg.secure_url
                    fs.unlinkSync(blogData.image.path);

                } catch (error) {
                    console.error('Error uploading image:', error);
                    throw new Error('Failed to upload image');
                }

            } else if (!blogData.keepExistingImage) {
                imageUrl = null;
            }
            const updateData: BlogUpdateData = {
                title: blogData.title,
                content: blogData.content,
                tags: blogData.tags,
                updatedAt: new Date(),
            };

            if (blogData.image || !blogData.keepExistingImage) {
                updateData['image'] = imageUrl;
            }

            const updatedBlog = await this.userRepository.updateBlog(blogData.blogId, updateData)
            return updatedBlog
        } catch (error) {
            console.error('Error in updateBlog usecase:', error);
            throw error;
        }
    }
}

export default userUseCase