import { Module } from '@nestjs/common';
import { UploadScalar } from './uploader.scalar';
import { UploaderService } from './uploader.service';
import { UploaderResolver } from './uploader.resolver';
import { env } from '../utils/env';
import { FilesReferencesChecking } from './files-references-checking';

@Module({
  providers: [
    UploadScalar,
    UploaderService,
    UploaderResolver,
    ...(env.NODE_ENV !== 'development' ? [FilesReferencesChecking] : [])
  ],
  exports: [UploadScalar, UploaderService]
})
export class UploaderModule {}
