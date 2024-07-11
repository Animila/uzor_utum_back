import {ITokenRepository} from "../../repositories/ITokenRepository";
import {Token} from "../../domain/user/token";
import {User} from "../../domain/user/user";
import {generateCode} from "../../infrastructure/crypto/generateCode";
import {TokenCode} from "../../domain/user/valueObjects/tokenCode";

interface CreateTokenInput {
    userId: string
}

export default class CreateToken {
    private tokenRepository: ITokenRepository

    constructor(tokenRepository: ITokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    async execute(input: CreateTokenInput): Promise<Token> {
        const {userId} = input
        const code = TokenCode.create()
        const token = new Token({
            userId: userId,
            createdAt: new Date(),
            activatedAt: false,
            token: code
        })
        await this.tokenRepository.save(token)
        return token
    }
}