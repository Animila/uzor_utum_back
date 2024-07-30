import { Token } from "../domain/user/token";

export interface ITokenRepository {
    save(data: Token): Promise<Token | null>;
    findValidToken(token: string): Promise<Token | null>;
    findTokenByUserAndCode(userId: string, token: string): Promise<boolean>;
}