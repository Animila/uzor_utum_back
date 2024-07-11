import {generateUUID} from "../../infrastructure/uuid/generate";
import {TokenCode} from "./valueObjects/tokenCode";

interface IToken {
    userId: string;
    token: TokenCode
    activatedAt: boolean;
    createdAt: Date;
}

export class Token {
    protected readonly _id: string
    public readonly props: IToken

    constructor(props: IToken, id?: string) {
        this._id = id || generateUUID('token');
        this.props = props;
    }

    getId(): string { return this._id }

    getUserId(): string { return this.props.userId }

    getToken(): TokenCode { return this.props.token }

    getActivatedAs(): boolean { return this.props.activatedAt }

    getCreatedAt(): Date { return this.props.createdAt }

    activateToken(): void {
        this.props.activatedAt = true;
    }

}



