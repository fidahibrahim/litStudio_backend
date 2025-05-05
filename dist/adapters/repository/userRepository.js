"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class userRepository {
    constructor(user, blog) {
        this.user = user;
        this.blog = blog;
    }
    async checkEmailExists(email) {
        return this.user.findOne({ email });
    }
    async createUser(name, email, password) {
        const user = new this.user({
            name,
            email,
            password
        });
        const savedUser = await user.save();
        return {
            _id: savedUser._id.toString(),
            name: savedUser.name,
            email: savedUser.email,
            password: savedUser.password
        };
    }
    async createBlog(data) {
        const newBlog = new this.blog({
            title: data.title,
            content: data.content,
            tags: data.tags,
            image: data.image,
            userId: data.userId
        });
        return await newBlog.save();
    }
    async findByUserId(userId) {
        try {
            const blogs = await this.blog.find({ userId })
                .populate('userId', '_id name email')
                .exec();
            return blogs.map(blog => ({
                _id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                authorId: {
                    _id: blog.userId._id.toString(),
                    name: blog.userId.name,
                    email: blog.userId.email,
                },
                image: blog.image,
                createdAt: blog.createdAt?.toString(),
            }));
        }
        catch (error) {
            console.log(error);
        }
    }
    async listBlogs() {
        try {
            const blogs = await this.blog.find()
                .populate("userId", "name email")
                .lean();
            const formattedBlogs = blogs.map((blog) => ({
                _id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                authorId: {
                    _id: blog.userId._id.toString(),
                    name: blog.userId.name,
                    email: blog.userId.email,
                },
                image: blog.image,
                createdAt: blog.createdAt?.toString(),
            }));
            return formattedBlogs;
        }
        catch (error) {
            console.log(error);
        }
    }
    async deleteBlog(blogId) {
        try {
            const result = await this.blog.findByIdAndDelete(blogId);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
    async getBlogById(blogId) {
        try {
            return await this.blog.findById(blogId)
                .populate('userId', 'name');
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateBlog(blogId, updateData) {
        try {
            const updatedBlog = await this.blog.findByIdAndUpdate(blogId, { $set: updateData }, { new: true });
            return updatedBlog;
        }
        catch (error) {
            console.error('Error updating blog:', error);
            throw error;
        }
    }
}
exports.default = userRepository;
