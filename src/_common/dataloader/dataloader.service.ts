import { Inject, Injectable } from '@nestjs/common';
import { TwitteDataloader } from 'src/twittes/dataloader/twittes.dataloader';
import { User } from 'src/user/entity/user.entity';
import { UserDataloader } from '../../user/dataloader/user.dataloader';
import { IDataLoaders, IDataLoaderService } from './dataloader.interface';

@Injectable()
export class DataloaderService implements IDataLoaderService {
  constructor(
    @Inject(UserDataloader) private readonly userLoader: IDataLoaderService,
    @Inject(TwitteDataloader) private readonly twitteLoader: IDataLoaderService,
  ) {}

  createLoaders(currentUser: User) {
    return {
      ...this.userLoader.createLoaders(),
      ...this.twitteLoader.createLoaders(),
    };
  }
}
