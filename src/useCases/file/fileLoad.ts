import {IFileRepo} from "../../repositories/IFileRepository";
import {File} from "../../domain/file/file";
import {PathSharp} from "../../infrastructure/local/PathSharp";

interface CreateFileInput {
    file: object,
    entity_id: string,
    entity_type: string
}

export default class LoadFile {
    private repository: IFileRepo
    private imageMimeTypes: string[] = [
        'image/apng',
        'image/bmp',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/webp',
        'image/x-icon'
    ];
    private localFile

    constructor(repository: IFileRepo) {
        this.repository = repository;
        this.localFile = new PathSharp(this.repository)
    }

    async execute(input: CreateFileInput): Promise<File> {
        const {file, entity_id, entity_type} = input
        console.log(file, entity_id, entity_type)
        //@ts-ignore
        if(!this.imageMimeTypes.includes(file.mimetype)) {
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'files',
                        message: 'Неподходящий формат (только изображения)'
                    }
                ]
            }))
        }
        const dataFile = await this.localFile.upload(file, entity_type, entity_id)
        const fileOrError = new File({
            path: dataFile.path,
            typeFile: dataFile.filetype,
            entityType: dataFile.entity_type,
            entityId: dataFile.entity_id,
            name: dataFile.name
        })
        console.log('3456', fileOrError)

        const savedFile = await this.repository.save(fileOrError)
        if(!savedFile) throw new Error("Ошибка сохранения")
        return savedFile
    }
}
