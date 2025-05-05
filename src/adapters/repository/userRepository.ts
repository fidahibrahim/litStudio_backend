import { Model } from "mongoose";
import IUserRepository from "../../interface/IUserRepository";
import { IUser } from "../../entities/userEntity";
import { IBlog, IBlogRes } from "../../entities/blogEntity";
import { BlogUpdateData } from "../../interface/IUserUseCase";

class userRepository implements IUserRepository {
    private user: Model<IUser>
    private blog: Model<IBlog>

    constructor(
        user: Model<IUser>,
        blog: Model<IBlog>
    ) {
        this.user = user
        this.blog = blog
    }

    async checkEmailExists(email: string) {
        return this.user.findOne({ email })
    }

    async createUser(name: string, email: string, password: string) {
        const user = new this.user({
            name,
            email,
            password
        })
        const savedUser = await user.save()
        return {
            _id: savedUser._id.toString(),
            name: savedUser.name,
            email: savedUser.email,
            password: savedUser.password
        }
    }

    async createBlog(data: IBlog) {
        const newBlog = new this.blog({
            title: data.title,
            content: data.content,
            tags: data.tags,
            image: data.image,
            userId: data.userId
        })
        return await newBlog.save()
    }

    async findByUserId(userId: string) {
        try {
            const blogs = await this.blog.find({ userId })
                .populate('userId', '_id name email')
                .exec()
            return blogs.map(blog => ({
                _id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                authorId: {
                    _id: (blog.userId as any)._id.toString(),
                    name: (blog.userId as any).name,
                    email: (blog.userId as any).email,
                },
                image: blog.image,
                createdAt: blog.createdAt?.toString(),
            }))
        } catch (error) {
            console.log(error)
        }
    }
    async listBlogs() {
        try {
            const blogs = await this.blog.find()
                .populate("userId", "name email")
                .lean()

            const formattedBlogs: IBlogRes[] = blogs.map((blog) => ({
                _id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
                authorId: {
                    _id: (blog.userId as any)._id.toString(),
                    name: (blog.userId as any).name,
                    email: (blog.userId as any).email,
                },
                image: blog.image,
                createdAt: blog.createdAt?.toString(),
            }));
            return formattedBlogs
        } catch (error) {
            console.log(error)
        }
    }

    async deleteBlog(blogId: string) {
        try {
            const result = await this.blog.findByIdAndDelete(blogId);
            return result
        } catch (error) {
            console.log(error)
        }
    }

    async getBlogById(blogId: string) {
        try {
            return await this.blog.findById(blogId)
                .populate('userId', 'name')
        } catch (error) {
            console.log(error)
        }
    }

    async updateBlog(blogId: string, updateData: BlogUpdateData) {
        try {
            const updatedBlog = await this.blog.findByIdAndUpdate(
                blogId,
                { $set: updateData },
                { new: true }
            )
            return updatedBlog
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error;
        }
    }
}

export default userRepository