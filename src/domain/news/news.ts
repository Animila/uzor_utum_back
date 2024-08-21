import {generateUUID} from "../../infrastructure/uuid/generate";

interface INews {
    title: string
    journalId: string
    about: string
    text: string
    views: number
    images?: any
    createdAt: Date
}

export class News {
    protected readonly _id: string
    public readonly props: INews

    constructor(props: INews, id?: string) {
        this._id = id || generateUUID('news');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

    getJournalId(): string { return this.props.journalId }

    getImages(): any { return this.props.images }

    getAbout(): string { return this.props.about }

    getText(): string { return this.props.text }

    getViews(): number { return this.props.views }

    getCreatedAt(): Date { return this.props.createdAt }

    setView(): void {
        this.props.views += 1
    }

}



