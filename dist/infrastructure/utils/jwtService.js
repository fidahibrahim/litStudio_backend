"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class jwtService {
    generateToken(data) {
        let secretKey = process.env.JWT_SECRET_KEY;
        if (secretKey) {
            let token = jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: '15m' });
            return token;
        }
        throw new Error("Failed to get Secret Key");
    }
    generateRefreshToken(data) {
        let secretKey = process.env.JWT_REFRESH_SECRET_KEY;
        if (secretKey) {
            let refreshToken = jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: '7d' });
            return refreshToken;
        }
        throw new Error("Failed to get Refresh secret Key");
    }
    verifyToken(token) {
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error("Secret key is not defined");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            return decoded;
        }
        catch (error) {
            throw new Error("Invalid or expired token");
        }
    }
    verifyRefreshToken(token) {
        const secretKey = process.env.JWT_REFRESH_SECRET_KEY;
        if (!secretKey) {
            throw new Error("Secret key is not defined");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            return decoded;
        }
        catch (error) {
            throw new Error("Invalid or expired token");
        }
    }
}
exports.default = jwtService;
