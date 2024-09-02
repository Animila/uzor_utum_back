import {generateUUID} from "../../infrastructure/uuid/generate";
import {Email} from "./valueObjects/email";
import {Phone} from "./valueObjects/phone";
import {Role} from "./valueObjects/role";

interface IUser {
    phone: Phone;
    email: Email;
    role: Role;
    firstName: string;
    lastName: string;
    acceptedAt: boolean;
    activatedAt: boolean;
    lastOnlineAt: Date
    createdAt: Date;
    updatedAt?: Date;
}

export class User {
    protected readonly _id: string
    public readonly props: IUser

    constructor(props: IUser, id?: string) {
        this._id = id || generateUUID('user');
        this.props = props;
    }

    getId(): string { return this._id }

    getEmail(): Email { return this.props.email }

    getPhone(): Phone { return this.props.phone }

    getRole(): Role { return this.props.role }

    getFirstName(): string { return this.props.firstName }

    getLastName(): string { return this.props.lastName; }

    getAcceptedAs(): boolean { return this.props.acceptedAt }

    getActivatedAs(): boolean { return this.props.activatedAt }

    getLastOnlineAt(): Date { return this.props.lastOnlineAt }

    getCreatedAt(): Date { return this.props.createdAt }

    getUpdatedAt(): Date | undefined { return this.props.updatedAt }

    markAsReadTerms(): void {
        this.props.acceptedAt = true;
        this.props.updatedAt = new Date();
    }

}



