import {IFileRepo} from "../../repositories/IFileRepository";
import {File} from "../../domain/file/file";
import {PathSharp} from "../../infrastructure/local/PathSharp";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import {FFMPEGVideo} from "../../infrastructure/ffmpeg/FFMPEGVideo";

interface CreateFileInput {
    file: any,
    entity_id: string,
    entity_type: string
    position: number
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
    private videoMimeTypes: string[] = [
        'video/mp4',
        'video/quicktime',  // Для iPhone (MOV)
        'video/x-matroska',
        'video/x-msvideo',
        'video/x-ms-wmv'
    ];
    private localFile
    private localVideo

    constructor(repository: IFileRepo) {
        this.repository = repository;
        this.localFile = new PathSharp(this.repository)
        this.localVideo = new FFMPEGVideo(this.repository)
    }

    async execute(input: CreateFileInput): Promise<File> {
        const {file, entity_id, entity_type, position} = input;

        const mimeType = file.mimetype;

        // Обработка изображений
        if (this.imageMimeTypes.includes(mimeType)) {
            return this.processImage(file, entity_id, entity_type, position);
        } else if (this.videoMimeTypes.includes(mimeType)) {
            return this.processVideo(file, entity_id, entity_type, position);
        }
        else {
            throw new Error(JSON.stringify({
                status: 400,
                message: [
                    {
                        type: 'file',
                        message: 'Неподходящий формат (только изображения или видео)'
                    }
                ]
            }));
        }
    }

    private async processImage(file: any, entity_id: string, entity_type: string, position: number): Promise<File> {
        const dataFile = await this.localFile.upload(file, entity_type, entity_id);
        const fileOrError = new File({
            path: dataFile.path,
            typeFile: dataFile.filetype,
            entityType: dataFile.entity_type,
            entityId: dataFile.entity_id,
            name: dataFile.name,
            position: position
        });

        const savedFile = await this.repository.save(fileOrError);
        if (!savedFile) throw new Error("Ошибка сохранения");
        return savedFile;
    }

    private async processVideo(file: any, entity_id: string, entity_type: string, position: number): Promise<File> {
        const dataFile = await this.localVideo.upload(file, entity_type, entity_id);
        const fileOrError = new File({
            path: dataFile.path,
            typeFile: dataFile.filetype,
            entityType: dataFile.entity_type,
            entityId: dataFile.entity_id,
            name: dataFile.name,
            position: position
        });

        const savedFile = await this.repository.save(fileOrError);
        if (!savedFile) throw new Error("Ошибка сохранения");
        return savedFile;
    }
}
