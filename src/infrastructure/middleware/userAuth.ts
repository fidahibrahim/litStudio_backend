import userSchema from "../model/userSchema";
import jwtService from "../utils/jwtService";
import { NextFunction, Response, Request } from "express";

const JwtService = new jwtService()

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies.userRefreshToken;
    let userToken = req.cookies.userToken;
  
    if (!refreshToken) {
      res.status(401).json({ status: false, message: "Not authorized" });
      return;
    }
  
    if (!userToken || userToken === '' || Object.keys(userToken).length === 0) {
      try {
        const newUserToken = await refreshAccessToken(refreshToken);
        res.cookie("userToken", newUserToken, {
          httpOnly: true,
          maxAge: 3600000,
          secure: process.env.NODE_ENV !== "production"
        });
        userToken = newUserToken;
      } catch (error) {
        res.status(401).json({ message: "Failed to refresh access token" });
        return;
      }
    }
  
    try {
      const decoded = JwtService.verifyToken(userToken);
      let user;
      if (decoded) {
        user = await userSchema.findById(decoded.id); // use `findById` for single doc
      }
  
      if (!user) {
        res.status(401).json({ status: false, message: "Not Authorized, User not found" });
        return;
      }
  
      next();
    } catch (error) {
      res.status(401).json({ status: false, message: "Not authorized, invalid token" });
      return;
    }
  };
  

async function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = await JwtService.verifyRefreshToken(refreshToken);
    if (decoded && decoded.name) {
      const newToken = await JwtService.generateToken({ id: decoded.userId, name: decoded.name });
      return newToken;
    }
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}

export default userAuth;