import {ITokenRepository} from "../../repositories/ITokenRepository";

interface UpdateTokenInput {
    token: string
}

export default class UpdateToken {
    private tokenRepository: ITokenRepository

    constructor(tokenRepository: ITokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    async execute(input: UpdateTokenInput): Promise<string> {

        const {token} = input
        const existingToken = await this.tokenRepository.findValidToken(token.toString())
        if(!existingToken)
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Код не подходит'
            }))
        existingToken.activateToken()
        await this.tokenRepository.save(existingToken)
        return existingToken.getUserId()
    }
}