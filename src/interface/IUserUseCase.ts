import { IBlog, IBlogRes } from "../entities/blogEntity"

export interface IReturnMessage {
    status: boolean,
    message: any,
    data?: any
}

export interface UpdateBlog {
    blogId: string;
    userId: string;
    title: string;
    content: string;
    tags: string[];
    image: {
        filename: string;
        path: string;
        mimetype: string;
    } | null;
    keepExistingImage: boolean;
}

export interface BlogUpdateData {
    title: string;
    content: string;
    tags: string[];
    updatedAt: Date;
    image?: string | null;
}

export default interface IUserUseCase {
    register(name: string, email: string, password: string): Promise<IReturnMessage>
    login(email: string, password: string): Promise<IReturnMessage>
    addBlog(data: IBlog): Promise<IBlog>
    fetchUserBlogs(userId: string): Promise<IBlogRes[] | undefined>
    listBlogs(): Promise<IBlogRes[] | undefined>
    deleteBlog(blogId: string): Promise<IBlog | null | undefined>
    getBlogById(blogId: string): Promise<IBlog | null | undefined>
    updateBlog(blogData: UpdateBlog): Promise<any>
}