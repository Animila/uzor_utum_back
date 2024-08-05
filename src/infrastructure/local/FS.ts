import path from 'path';
import fs from 'fs';
import {format} from "date-fns";
import {v4 as uuidv4} from "uuid";

export class FileUploadService {

    private fileRepo: any

    constructor(fileRepo: any) {
        this.fileRepo = fileRepo
    }



    async upload(file: any, type: string, entity_id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!file || !file.data) {
                throw new Error('Нет данных')
            }
            const currentDate = new Date()
            const formattedDate = format(currentDate, 'yyyy-MM-dd_HH-mm-ss')
            const uniqueCode = uuidv4()
            const storageDirectory = path.join(__dirname, '../../../storage', type)
            console.log(storageDirectory)
            if (!fs.existsSync(storageDirectory)) {
                fs.mkdirSync(storageDirectory, { recursive: true })
            }
            const typeDirectory = path.join(storageDirectory, getFileType(file.mimetype))
            if (!fs.existsSync(typeDirectory)) {
                fs.mkdirSync(typeDirectory, { recursive: true })
            }

            const filePath = path.join(typeDirectory, `${formattedDate}_${uniqueCode}.${file.mimetype.split('/')[1]}`);
           try {
               fs.writeFile(filePath, file.data, err => {
                   if (err) {
                       console.error('Ошибка при сохранении файла:', err)
                   } else {
                       console.log('Файл успешно сохранен:', filePath)
                       const data = {
                           name: `${formattedDate}_${uniqueCode}.${file.mimetype.split('/')[1]}`,
                           path: '/' + type + `/${getFileType(file.mimetype)}/` + `${formattedDate}_${uniqueCode}.${file.mimetype.split('/')[1]}`,
                           entity_type: type,
                           entity_id: entity_id,
                           filetype: getFileType(file.mimetype)
                       };
                       resolve(data);
                   }
               })
           } catch (error) {
               console.log(error)
           }



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

function getFileType(mimeType: string): string {
    return mimeType.split('/')[0];
}