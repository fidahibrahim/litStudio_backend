export default interface IJwtService {
    generateToken(data: any): string
    generateRefreshToken(data: any): string
}