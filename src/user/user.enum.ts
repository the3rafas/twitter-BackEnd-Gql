import { registerEnumType } from '@nestjs/graphql';

export enum TGenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}
registerEnumType(TGenderEnum, { name: 'UserRoleEnum' });

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(GenderEnum, { name: 'GenderEnum' });

export enum LangEnum {
  EN = 'EN',
  AR = 'AR',
}
registerEnumType(LangEnum, { name: 'LangEnum' });
