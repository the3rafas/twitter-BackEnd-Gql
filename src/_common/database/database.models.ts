import { plural } from 'pluralize';
import { Code } from 'src/email-verification/entity/email-validate.entity';
import { Comment } from 'src/twittes/entity/comments.entity';
import { Like } from 'src/twittes/entity/likes.entity';
import { Twitte } from 'src/twittes/entity/twitter-twittes.entity';
import { Follower } from 'src/user/entity/follower.entity';
import { Friend } from 'src/user/entity/friend.entity';
import { User } from 'src/user/entity/user.entity';
import { File } from '../uploader/file.model';
import { buildRepository } from './database-repository.builder';

export const models = [
  User,
  Follower,
  Twitte,
  File,
  Like,
  Comment,
  Code, //CodesRepository
  Friend
];

export const repositories = models.map((m) => ({
  provide: `${plural(m.name)}Repository`,
  useClass: buildRepository(m),
}));
