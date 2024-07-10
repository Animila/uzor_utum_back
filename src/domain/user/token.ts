import {generateUUID} from "../../infrastructure/uuid/generate";

interface IToken {
    userId: string;
    token: number;
    activatedAt: boolean;
    createdAt: Date;
}

export class Token {
    protected readonly _id: string
    public readonly props: IToken

    private constructor(props: IToken, id?: string) {
        this._id = id || generateUUID('token');
        this.props = props;
    }

    getUserId(): string { return this.props.userId }

    getToken(): number { return this.props.token }

    getActivatedAs(): boolean { return this.props.activatedAt }

    getCreatedAt(): Date { return this.props.createdAt }

    activateToken(): void {
        this.props.activatedAt = true;
    }

}



