import {tokens as PersistenceToken} from "@prisma/client";
import {Token} from "../domain/user/token";
import {TokenCode} from "../domain/user/valueObjects/tokenCode";


export class TokenMap {
    public static toDomain(raw: PersistenceToken): Token | null {
        const token = new Token({
            userId: raw.user_id,
            token: TokenCode.create(raw.token),
            activatedAt: raw.activated_at,
            createdAt: raw.created_at
        }, raw.id)

        if(!token) return null

        return token
    }

    public static toPersistence(token: Token): {
        id: string
        user_id: string
        token: number
        activated_at: boolean
        created_at: Date
    } {
        return {
            id: token.getId(),
            user_id: token.getUserId(),
            token: token.getToken().props.value,
            activated_at: token.getActivatedAs(),
            created_at: token.getCreatedAt(),
        }
    }
}