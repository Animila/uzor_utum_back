import {ITokenRepository} from "../../../repositories/ITokenRepository";
import {PrismaClient, Roles} from "@prisma/client";
import {Token} from "../../../domain/user/token";
import {TokenMap} from "../../../mappers/TokenMap";

export class PrismaTokenRepo implements ITokenRepository {
    private prisma = new PrismaClient();

    async findTokenByUserAndCode(userId: string, token: number): Promise<boolean> {
        if (!userId) {
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет user_id'
            }));
        }
        if (!token) {
            throw new Error(JSON.stringify({
                status: 400,
                message: 'Нет token'
            }));
        }
        const tokenRecord = await this.prisma.tokens.findFirst({
            where: {
                user_id: userId,
                token,
            },
        });
        return !!tokenRecord;
    }

    async findValidToken(token: number): Promise<Token | null> {
        const tokenRecord = await this.prisma.tokens.findFirst({
            where: {
                token: token,
                activated_at: false,
            },
        });
        if (!tokenRecord) return null;
        return TokenMap.toDomain(tokenRecord)
    }

    async save(data: Token): Promise<Token| null> {
        try {
            const dataPer = TokenMap.toPersistence(data)
            const newToken = await this.prisma.tokens.upsert({
                where: {id: dataPer.id},
                create: {
                    id: dataPer.id,
                    token: dataPer.token,
                    user_id: dataPer.user_id,
                    created_at: dataPer.created_at,
                    activated_at: dataPer.activated_at
                },
                update: {
                    id: dataPer.id,
                    token: dataPer.token,
                    user_id: dataPer.user_id,
                    created_at: dataPer.created_at,
                    activated_at: dataPer.activated_at
                }
            })
            if(!newToken) return null
            return TokenMap.toDomain(newToken)
        } catch (error: any) {
            throw new Error(JSON.stringify({
                status: 409,
                message: 'Такой токен уже существует'
            }));
        }
    }
}