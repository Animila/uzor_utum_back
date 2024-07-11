import {ITokenRepository} from "../../repositories/ITokenRepository";
import {Token} from "../../domain/user/token";
import {TokenCode} from "../../domain/user/valueObjects/tokenCode";

interface UpdateTokenInput {
    token: number
}

export default class UpdateToken {
    private tokenRepository: ITokenRepository

    constructor(tokenRepository: ITokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    async execute(input: UpdateTokenInput): Promise<boolean> {
        try {
            const {token} = input
            const existingToken = await this.tokenRepository.findValidToken(token)
            if(!existingToken)
                throw new Error(JSON.stringify({
                    status: 404,
                    message: 'Код не подходит'
                }))
            existingToken.activateToken()
            await this.tokenRepository.save(existingToken)
            return true
        } catch (error) {
            return false
        }
    }
}