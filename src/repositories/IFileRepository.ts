import { File } from "../domain/file/file";

export interface IFileRepo {
    save(file: File): Promise<File | null>
    getById(id: string): Promise<File | null>
    getByEntityIdAndType(entity_type: string, entity_id: string): Promise<File[]>
    delete(id: string): Promise<boolean>
}