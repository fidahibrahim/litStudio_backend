export default interface IHashingService {
    hashing(password: string): Promise<string>
    compare(password: string, hashedPass: string): Promise<boolean>
}