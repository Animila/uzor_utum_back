import { Material } from "../domain/products/materials";

export interface IMaterialRepository {
    save(material: Material): Promise<Material | null>;
    findAll(limit: number, offset: number ): Promise<{data: Material[], count: number}>;
    findById(id: string): Promise<Material | null>;
    findByTitle(title: string): Promise<Material | null>;
    delete(id: string): Promise<boolean>;
}
