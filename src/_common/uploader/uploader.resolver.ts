import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UploadFileInput } from './upload-file.input';
import { UploaderService } from './uploader.service';
import { GqlStringResponse } from '../graphql/graphql-response.type';
// import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/auth-user.decorator';
@Resolver()
export class UploaderResolver {
  constructor(private readonly uploadService: UploaderService) {}

  // @UseGuards(AuthGuard) // Auth for upload (issue: STOP IT BECAUSE OF REGISTRATION)
  @Mutation(returns => GqlStringResponse)
  async uploadFile(@Args() input: UploadFileInput, @CurrentUser('id') currentUserId: string) {
    return await this.uploadService.graphqlUpload(
      { file: input.file, saveTo: input.model },
      currentUserId
    );
  }
}
