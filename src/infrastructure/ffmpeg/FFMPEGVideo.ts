import {format} from "date-fns";
import {v4 as uuidv4} from "uuid";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import {IFileRepo} from "../../repositories/IFileRepository";
import ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

export class FFMPEGVideo {
    private fileRepo: IFileRepo

    constructor(fileRepo: IFileRepo) {
        this.fileRepo = fileRepo
    }

    async upload(file: any, type: string, entity_id: string): Promise<any> {
        if (!file || !file._buf) {
            throw new Error('Нет данных изображений или файл пустой')
        }
        const currentDate = new Date()
        const formattedDate = format(currentDate, 'yyyy-MM-dd_HH-mm-ss')
        const uniqueCode = uuidv4()
        const fileName = `${formattedDate}_${uniqueCode}.mp4`
        const storageDirectory = path.join(__dirname, '../../../storage', type)
        if (!fs.existsSync(storageDirectory)) {
            fs.mkdirSync(storageDirectory, { recursive: true })
        }
        const typeDirectory = path.join(storageDirectory, 'video/temp')
        if (!fs.existsSync(typeDirectory)) {
            fs.mkdirSync(typeDirectory, { recursive: true })
        }
        const tempInputPath = path.join(typeDirectory, 'temp.mp4');
        const pathDirectory = path.join(typeDirectory,'../', fileName);

        fs.writeFileSync(tempInputPath, file._buf);

        return new Promise((resolve, reject) => {
            ffmpeg(tempInputPath)
                .outputOptions([
                    '-vf', 'scale=1080:720:force_original_aspect_ratio=decrease',
                    '-c:v', 'libx264',
                    '-crf', '23',
                    '-preset', 'fast'
                ])
                .output(pathDirectory)
                .on('start', (commandLine) => {
                    console.log('Запуск команды: ' + commandLine);
                })
                .on('progress', (progress) => {
                    console.log('Обработка: ' + progress.percent + '% завершено');
                })
                .on('end', async () => {
                    const data = {
                        name: fileName,
                        path: '/' + type + '/video/' + fileName,
                        entity_type: type,
                        entity_id: entity_id,
                        filetype: 'video'
                    };
                    await this.delete('/' + data.entity_type + '/video/temp/temp.mp4')
                    resolve(data);
                })
                .on('error', (err: any, stdout: any, stderr: any) => {
                    console.error('Ошибка обработки видео: ' + err.message);
                    console.error('stdout: ' + stdout);
                    console.error('stderr: ' + stderr);
                    reject(new Error('Ошибка обработки видео: ' + err.message));
                })
                .run();
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
