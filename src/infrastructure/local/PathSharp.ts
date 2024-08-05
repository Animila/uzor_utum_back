import {format} from "date-fns";
import {v4 as uuidv4} from "uuid";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import {IFileRepo} from "../../repositories/IFileRepository";

export class PathSharp {
    private fileRepo: IFileRepo

    constructor(fileRepo: IFileRepo) {
        this.fileRepo = fileRepo
    }

    async upload(file: any, type: string, entity_id: string): Promise<any> {
        if (!file || !file.data) {
            throw new Error('Нет данных изображений')
        }
        const currentDate = new Date()
        const formattedDate = format(currentDate, 'yyyy-MM-dd_HH-mm-ss')
        const uniqueCode = uuidv4()
        const fileName = `${formattedDate}_${uniqueCode}.jpg`
        const storageDirectory = path.join(__dirname, '../../../storage', type)
        if (!fs.existsSync(storageDirectory)) {
            fs.mkdirSync(storageDirectory, { recursive: true })
        }
        const typeDirectory = path.join(storageDirectory, 'image')
        if (!fs.existsSync(typeDirectory)) {
            fs.mkdirSync(typeDirectory, { recursive: true })
        }
        const pathDirectory = path.join(typeDirectory, fileName)

        const maxWidth = 1000
        const maxHeight = 1000

        return new Promise((resolve, reject) => {

        sharp(file.data)
            .resize({
                width: maxWidth,
                height: maxHeight,
                fit: sharp.fit.inside,
                withoutEnlargement: true,
            })
            .jpeg({quality: 80})
            .toFile(pathDirectory, (err, info) => {
                if (err) {
                    console.error('Ошибка преобразования ' + err);
                    throw new Error('Ошибка преобразования ' + err);
                } else {


                    const data = {
                        name: fileName,
                        path: '/' + type + '/image/' + fileName,
                        entity_type: type,
                        entity_id: entity_id,
                        filetype: 'image'
                    }
                    resolve(data);
                }
            })
        });

    }

    async delete(filePath: string): Promise<any> {
        try {
            const absolutePath = path.join(
                __dirname,
                '../../../storage',
                filePath
            )
            console.log(absolutePath)

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath)
            }
        } catch (error: any) {
            throw new Error(`Ошибка удаления файла: ${error.message}`)
        }
    }
}