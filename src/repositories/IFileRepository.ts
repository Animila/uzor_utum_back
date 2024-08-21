import { File } from "../domain/file/file";

export interface IFileRepo {
    save(file: File): Promise<File | null>
    getById(id: string): Promise<File | null>
    getByEntityIdAndType(limit: number, offset: number, entity_type: string, entity_id: string): Promise<{data: File[], count: number}>
    delete(id: string): Promise<boolean>
}
