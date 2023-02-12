import { registerEnumType } from '@nestjs/graphql';

export enum FileModelEnum {
  USERS = 'users',
  EXPERTISE_LEVELS = 'expertise-levels',
  DOCTOR_SCHS = 'doctor-schs',
  DOCTOR_DOCUMENT = 'doctor-document',
  PROFILE_PICTURE = 'profile-picture',
  FAMILY_MEMBER_PROFILE = 'family-member-profile',
  CONSULTATIONS_ATTACHMENTS = 'consultations-attachments',
  APPOINTMENT_MESSAGES = 'appointment-messages'
}
registerEnumType(FileModelEnum, { name: 'FileModelEnum' });
