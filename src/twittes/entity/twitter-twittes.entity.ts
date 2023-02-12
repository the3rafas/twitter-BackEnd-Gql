import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { paginate } from 'src/_common/paginator/paginator.service';
import { getColumnEnum } from 'src/_common/utils/columnEnum';
import { Comment } from './comments.entity';
import { Like } from './likes.entity';

@Table({
  tableName: 'twittes-T',
})
@ObjectType()
export class Twitte extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @AllowNull(true)
  @Column
  @Field({ nullable: true })
  content?: string;

  @AllowNull(true)
  @Column
  @Field({ nullable: true })
  photo?: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  @Field()
  userId: string;

  @BelongsTo(() => User)
  followers: User[];

  @HasMany(() => Like)
  likes: Like[];
  @HasMany(() => Comment)
  comments: Comment[];

  static async paginate(
    filter = {},
    sort = '-createdAt',
    page = 0,
    limit = 15,
    include: any = [],
  ) {
    return paginate<Twitte>(this, filter, sort, page, limit, include);
  }
}
