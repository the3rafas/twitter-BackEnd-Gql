import { Field, ObjectType } from '@nestjs/graphql';
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
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { UserVerificationCodeUseCaseEnum } from '../email-Validator.interface';
// import { UserFollower } from './follower.entity';

@Table({
  tableName: 'ValidationCode',
})
@ObjectType()
export class Code extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Field()
  @Column({
    type: DataType.UUID,
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  id: string;

  @Default(UserVerificationCodeUseCaseEnum.PASSWORD_RESET)
  @AllowNull(false)
  @Column
  useCase: UserVerificationCodeUseCaseEnum;

  @AllowNull(false)
  @Column
  code: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  expiryDate: Date;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
