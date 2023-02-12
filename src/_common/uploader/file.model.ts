import {
  Model,
  Table,
  PrimaryKey,
  DataType,
  Default,
  Column,
  AllowNull,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { ModelWhichUploadedFor } from './uploader.type';

@Table({
  timestamps: true,
  tableName: 'Files',
  indexes: [{ fields: [{ name: 'hasReferenceAtDatabase' }] }],
  paranoid: true
})
export class File extends Model{
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Column
  relativeDiskDestination: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  encoding?: string;

  @AllowNull(false)
  @Column
  mimetype?: string;

  @AllowNull(true)
  @Column
  sizeInBytes?: number;

  @Default([])
  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  downloadedByUsersIds?: string[];

  @Default(false)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  hasReferenceAtDatabase: boolean;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  modelWhichUploadedFor?: ModelWhichUploadedFor;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ onDelete: 'SET NULL', type: DataType.UUID })
  uploadedById?: string;

  @BelongsTo(() => User)
  uploadedBy?: User;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
