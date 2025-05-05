import { IBlog, IBlogRes } from "../entities/blogEntity";
import { IUser } from "../entities/userEntity";
import { BlogUpdateData, UpdateBlog } from "./IUserUseCase";

export default interface IUserRepository {
    checkEmailExists(email: string): Promise<IUser | null>
    createUser(name: string, email: string, password: string): Promise<IUser>
    createBlog(data: IBlog): Promise<IBlog>
    findByUserId(userId: string): Promise<IBlogRes[] | undefined>
    listBlogs(): Promise<IBlogRes[] | undefined>
    deleteBlog(blogId: string): Promise<IBlog | null | undefined>
    getBlogById(blogId: string): Promise<IBlog | null | undefined>
    updateBlog(blogId: string, updateData: BlogUpdateData): Promise<IBlog | null>
}