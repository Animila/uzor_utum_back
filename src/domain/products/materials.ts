import {generateUUID} from "../../infrastructure/uuid/generate";

interface IMaterials {
    title: string
}

export class Material {
    protected readonly _id: string
    public readonly props: IMaterials

    constructor(props: IMaterials, id?: string) {
        this._id = id || generateUUID('material');
        this.props = props;
    }

    getId(): string { return this._id }

    getTitle(): string { return this.props.title }

}



