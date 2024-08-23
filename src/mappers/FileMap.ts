import {files as PersistenceData} from "@prisma/client";
import { File } from "../domain/file/file";

export class FileMap {
    public static toDomain(raw: PersistenceData): File | null {
        const fileOrError = new File({
            name: raw.name,
            entityId: raw.entity_id,
            entityType: raw.entity_type,
            typeFile: raw.typefile,
            path: raw.path,
            position: raw.position
        }, raw.id)
        if(!fileOrError) return null
        return fileOrError
    }

    public static toPersistence(file: File): {
        id: string,
        name: string,
        entity_id: string,
        entity_type: string,
        type_file: string,
        position: number,
        path: string,
    } {
        return {
            id: file.getId(),
            name: file.getName(),
            entity_id: file.getEntityId(),
            entity_type: file.getEntityType(),
            type_file: file.getTypeFile(),
            path: file.getPath(),
            position: file.getPosition(),
        }
    }
}
