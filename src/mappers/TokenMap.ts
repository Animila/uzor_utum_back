import { tokens as PersistenceData } from "@prisma/client";
import { Token } from "../domain/user/token";
import { TokenCode } from "../domain/user/valueObjects/tokenCode";


export class TokenMap {
    public static toDomain(raw: PersistenceData): Token | null {
        const result = new Token({
            userId: raw.user_id,
            token: TokenCode.create(raw.token),
            activatedAt: raw.activated_at,
            createdAt: raw.created_at
        }, raw.id)

        if(!result) return null
        return result
    }

    public static toPersistence(data: Token): {
        id: string
        user_id: string
        token: number
        activated_at: boolean
        created_at: Date
    } {
        return {
            id: data.getId(),
            user_id: data.getUserId(),
            token: data.getToken().props.value,
            activated_at: data.getActivatedAs(),
            created_at: data.getCreatedAt(),
        }
    }
}