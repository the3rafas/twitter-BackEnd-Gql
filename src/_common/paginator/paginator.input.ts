import { InputType, Field, ArgsType } from '@nestjs/graphql';
import { Min, IsOptional, ValidateNested } from 'class-validator';
import { CursorBasedPaginationDirection, CursorBasedSortType } from './paginator.types';

@InputType()
export class PaginatorInput {
  @Min(1)
  @Field({ defaultValue: 1 })
  page?: number;

  @Min(1)
  @Field({ defaultValue: 15 })
  limit?: number;
}

@ArgsType()
export class NullablePaginatorInput {
  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  paginate?: PaginatorInput;
}

@InputType()
export class CursorBasedPaginatorInput {
  @Field({ nullable: true })
  cursor?: string;

  @Field(() => CursorBasedPaginationDirection, { nullable: true })
  direction?: CursorBasedPaginationDirection;

  @Min(1)
  @Field({ defaultValue: 15 })
  limit?: number;

  @Field(() => CursorBasedSortType, { nullable: true })
  sort?: CursorBasedSortType;
}

@ArgsType()
export class NullableCursorBasedPaginatorInput {
  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  paginate?: CursorBasedPaginatorInput;
}
