import jwt from "jsonwebtoken"
import IJwtService from "../../interface/IJwtService";

class jwtService implements IJwtService {
    generateToken(data: any) {
        let secretKey = process.env.JWT_SECRET_KEY
        if(secretKey){
            let token = jwt.sign(data, secretKey, { expiresIn: '15m' })
            return token
        }
        throw new Error("Failed to get Secret Key")
    }

    generateRefreshToken(data: any) {
        let secretKey = process.env.JWT_REFRESH_SECRET_KEY
        if(secretKey){
            let refreshToken = jwt.sign(data, secretKey, { expiresIn: '7d' })
            return refreshToken
        }
        throw new Error("Failed to get Refresh secret Key")
    }

    verifyToken(token: string): any {
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
          throw new Error("Secret key is not defined");
        }
        try {
          const decoded = jwt.verify(token, secretKey) as any;
          return decoded;
        } catch (error) {
          throw new Error("Invalid or expired token");
        }
      }
      
    
      verifyRefreshToken(token: string): any {
        const secretKey = process.env.JWT_REFRESH_SECRET_KEY;
        if (!secretKey) {
          throw new Error("Secret key is not defined");
        }
        try {
          const decoded = jwt.verify(token, secretKey) as any;
          return decoded;
        } catch (error) {
          throw new Error("Invalid or expired token");
        }
      }
}

export default jwtService