import {generateUUID} from "../../infrastructure/uuid/generate";
import {Email} from "../user/valueObjects/email";

interface IMail {
    to: Email // куда
    subject: string //тема
    html?: string // либо текст либо HTML
    files?: any
    text?: string
}

export class Mail {
    protected readonly _id: string
    public readonly props: IMail

    constructor(props: IMail, id?: string) {
        this._id = id || generateUUID('mail');
        this.props = props;
    }

    getId(): string { return this._id }
    getTo(): Email {return this.props.to}
    getSubject(): string {return this.props.subject}
    getHtml(): string | undefined {return this.props.html}
    getFiles(): any | undefined {return this.props.files}
    getText(): string | undefined {return this.props.text}

    setHtml(text: string): void { this.props.html = text }

}



