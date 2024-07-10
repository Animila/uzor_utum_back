import {generateCode} from "../../../infrastructure/crypto/generateCode";
import {Guard} from "../../guard";

interface ITokenCode {
    value: number
}

export class TokenCode {
    public readonly props: ITokenCode

    private constructor(props: ITokenCode) {
        this.props = Object.freeze(props)
    }

    public static create(value?: number): TokenCode|Error {
        const propsResult = Guard.againstNullOrUndefined(value, 'email_code')
        if (!propsResult.succeeded) value = generateCode()

        return new TokenCode({
            value: value!
        })
    }
}