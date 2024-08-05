import {generateUUID} from "../../infrastructure/uuid/generate";

interface IFile {
    name: string
    path: string
    entityType: string
    entityId: string
    typeFile: string
}

export class File {
    protected readonly _id: string
    public readonly props: IFile

    constructor(props: IFile, id?: string) {
        this._id = id || generateUUID('file');
        this.props = props;
    }

    getId(): string { return this._id }
    getName(): string { return this.props.name }
    getPath(): string { return this.props.path }
    getEntityType(): string { return this.props.entityType }
    getEntityId(): string { return this.props.entityId }
    getTypeFile(): string { return this.props.typeFile }
}



