import {generateCode} from "../../../infrastructure/crypto/generateCode";
import {Guard} from "../../guard";

interface ITokenCode {
    value: string
}

export class TokenCode {
    public readonly props: ITokenCode

    private constructor(props: ITokenCode) {
        this.props = Object.freeze(props)
    }

    public static create(value?: string): TokenCode {
        const propsResult = Guard.againstNullOrUndefined(value, 'email_code')
        if (!propsResult.succeeded) value = (generateCode()).toString()

        return new TokenCode({
            value: value!
        })
    }
}
