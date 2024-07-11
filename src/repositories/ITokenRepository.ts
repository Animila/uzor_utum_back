import {Token} from "../domain/user/token";

export interface ITokenRepository {
    save(token: Token): Promise<Token| null>;
    findValidToken(token: number): Promise<Token | null>;
    findTokenByUserAndCode(userId: string, token: number): Promise<boolean>;
}