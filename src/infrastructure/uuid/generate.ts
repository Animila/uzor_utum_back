import {v4 as uuidv4} from "uuid";

export function generateUUID(nameEntities: string): string {
    let timestamp = Date.now();
    let uniqueUUID = uuidv4();
    const fullUUID = uniqueUUID.split('-');
    return `${nameEntities}-${timestamp}-${fullUUID[fullUUID.length - 1]}`
}
