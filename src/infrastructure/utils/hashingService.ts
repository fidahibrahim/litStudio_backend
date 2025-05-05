import bcrypt from "bcrypt"
import IHashingService from "../../interface/IHashingService";

export default class HashingService implements IHashingService {
    async hashing(password: string){
        return await bcrypt.hash(password, 10)
    }

    async compare(password: string, hashedPass: string) {
        try {
            return await bcrypt.compare(password, hashedPass)
        } catch (error) {
            throw new Error("Failed to compare password")
        }
    }
}