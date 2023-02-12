import { Inject, Injectable } from '@nestjs/common';
import { createWriteStream, unlinkSync, existsSync, mkdirSync, writeFile, promises } from 'fs';
import { Upload, UploadedFile } from './uploader.type';
import { FileHandlingInput } from './upload-file.input';
import { File } from './file.model';
import { IRepository } from '../database/repository.interface';
import { Repositories } from '../database/database-repository.enum';

@Injectable()
export class UploaderService {
  constructor(@Inject(Repositories.FilesRepository) private readonly fileRepo: IRepository<File>) {}

  async graphqlUpload(input: FileHandlingInput, currentUserId: string): Promise<string> {
    const absoluteDiskDestination = `${process.cwd()}/public/${input.saveTo}`;

    // Delete the old file
    if (input.oldFile) {
      const filePath = `${absoluteDiskDestination}/${this.getFileNameFromUrl(input.oldFile)}`;
      if (existsSync(filePath)) this.deleteFile(filePath);
    }

    if (typeof input.file === 'string') {
      return input.file;
    } else {
      const { filename, createReadStream, mimetype, encoding } = await (<Promise<Upload>>(
        (<unknown>input.file)
      ));
      const name = `${Date.now()}-${filename}`;
      const relativeDiskDestination = `${input.saveTo}/${name}`;
      if (!existsSync(absoluteDiskDestination))
        mkdirSync(absoluteDiskDestination, { recursive: true });

      // Save the new file
      return new Promise((resolve, reject) => {
        createReadStream()
          .on('error', err => {
            this.deleteFile(`${absoluteDiskDestination}/${name}`);
            reject(err);
          })
          .pipe(createWriteStream(`${absoluteDiskDestination}/${name}`))
          .on('finish', async () => {
            const fileStat = await promises.stat(`${absoluteDiskDestination}/${name}`);
            await this.fileRepo.createOne({
              relativeDiskDestination,
              name,
              sizeInBytes: fileStat.size,
              hasReferenceAtDatabase: false,
              ...(encoding && { encoding }),
              ...(mimetype && { mimetype }),
              ...(input.modelWhichUploadedFor && {
                modelWhichUploadedFor: input.modelWhichUploadedFor
              }),
              ...(currentUserId && { uploadedById: currentUserId })
            });
            resolve(relativeDiskDestination);
          })
          .on('error', () => reject(false));
      });
    }
  }

  async restUpload(input: FileHandlingInput, currentUserId: string): Promise<string> {
    const absoluteDiskDestination = `${process.cwd()}/public/${input.saveTo}`;

    // Delete the old file
    if (input.oldFile) {
      const filePath = `${absoluteDiskDestination}/${this.getFileNameFromUrl(input.oldFile)}`;
      if (existsSync(filePath)) this.deleteFile(filePath);
    }

    if (typeof input.file === 'string') {
      return input.file;
    } else {
      const file = input.file as UploadedFile;
      const name = `${Date.now()}-${file.originalname}`;
      const relativeDiskDestination = `${input.saveTo}/${name}`;

      if (!existsSync(absoluteDiskDestination))
        mkdirSync(absoluteDiskDestination, { recursive: true });
      await this.asyncWrite(`${absoluteDiskDestination}/${name}`, file.buffer);

      const fileStat = await promises.stat(`${absoluteDiskDestination}/${name}`);
      await this.fileRepo.createOne({
        relativeDiskDestination,
        name,
        sizeInBytes: fileStat.size,
        hasReferenceAtDatabase: false,
        ...(file.mimetype && { mimetype: file.mimetype }),
        ...(input.modelWhichUploadedFor && {
          modelWhichUploadedFor: input.modelWhichUploadedFor
        }),
        ...(currentUserId && { uploadedById: currentUserId })
      });

      return relativeDiskDestination;
    }
  }

  private getFileNameFromUrl(url: string): string {
    return url.split('/').reverse()[0];
  }

  private deleteFile(file: string, saveTo?: string): void {
    let filePath = file;
    if (saveTo) filePath = `${process.cwd()}/public/${saveTo}/${this.getFileNameFromUrl(file)}`;
    if (existsSync(filePath)) unlinkSync(filePath);
  }

  private asyncWrite(path: string, data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      writeFile(path, data, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  async setUploadedFilesReferences(
    paths: string[],
    modelName: string,
    modelDestination: string,
    modelId: string
  ) {
    paths.forEach(async path => {
      const file = await this.fileRepo.findOne({ name: this.getFileNameFromUrl(path) });

      if (file)
        await this.fileRepo.updateOneFromExistingModel(file, {
          modelWhichUploadedFor: {
            modelName,
            modelDestination,
            modelId
          }
        });
    });
  }

  async removeOldFilesReferences(newFiles: string[] = [], oldFiles: string[] = []) {
    const unusedFiles = oldFiles.filter(file => !newFiles.includes(file));
    if (unusedFiles.length === 0) return;
    return await this.fileRepo.updateAll(
      { relativeDiskDestination: unusedFiles },
      { hasReferenceAtDatabase: false }
    );
  }
}
