import {v4 as uuidv4} from "uuid";

export function generateUUID(nameEntities: string): string {
    let timestamp = Date.now();
    let uniqueUUID = uuidv4();
    return `${nameEntities}-${timestamp}-${uniqueUUID}`
}