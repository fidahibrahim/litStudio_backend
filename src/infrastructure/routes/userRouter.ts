import express from "express";
import userRepository from "../../adapters/repository/userRepository";
import userSchema from "../model/userSchema";
import userUseCase from "../../useCase/userUseCase";
import userController from "../../adapters/controller/userController";
import HashingService from "../utils/hashingService";
import jwtService from "../utils/jwtService";
import upload from "../middleware/multer";
import { Blog } from "../model/blogSchema";
import userAuth from "../middleware/userAuth";

const userRouter = express.Router()

const JwtService = new jwtService()
const hashingService = new HashingService()
const UserRepository = new userRepository(userSchema, Blog)
const UserUseCase = new userUseCase(UserRepository, hashingService, JwtService)
const UserController = new userController(UserUseCase)

userRouter.post('/register', UserController.register)
userRouter.post('/login', UserController.login)
userRouter.post('/logout', UserController.logout)

userRouter.post('/addBlog', userAuth, upload.single('image'), UserController.addBlog)
userRouter.get('/getUserBlogs/:userId', userAuth, UserController.fetchUserBlogs)
userRouter.get('/listBlogs', userAuth, UserController.listBlogs)
userRouter.delete("/deleteBlog/:blogId", userAuth, UserController.deleteBlog)
userRouter.get('/fetchBlog/:blogId', userAuth, UserController.getBlogById)
userRouter.put('/blogs/update', userAuth, upload.single('image'), UserController.updateBlog)


export default userRouter