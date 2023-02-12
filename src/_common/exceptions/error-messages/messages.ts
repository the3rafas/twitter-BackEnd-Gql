import { IErrorMessage } from '../error-messages-interface';

export const enErrorMessage: IErrorMessage = {
  PERMISSION_DENIED: 'PERMISSION DENIED',
  UNAUTHORIZED: 'Unauthorized',
  EMAIL_ALREADY_EXISTS: 'EMAIL already exists',
  PHONE_ALREADY_EXISTS: 'PHONE already exists',
  USER_IS_NOT_VERIFIED_YET: 'User  is not verified yet',
  USER_DOES_NOT_EXIST: 'User does not exist',
  USER_EMAIL_IS_NOT_VERIFIED_YET: 'User email is not verified yet',
  VERIFICATION_CODE_NOT_EXIST: 'Verification code does not exist',
  EXPIRED_VERIFICATION_CODE: 'Expired verification code',
  TWITTE_DOES_NOT_EXIST: 'Twitte does not exist',
  COMMENT_DOES_NOT_EXIST: 'Comment does not exist',
  WRONG_PASSWORD: 'Wrong password',
  USER_PHONE_ALREADY_VERIFIED: 'User phone is already verified',
  INCORRECT_PHONE_OR_PASSWORD: 'Incorrect phone number or password',
  CONFIRM_PASSWORD_DOESN_T_MATCH: 'Confirm password does not match',
  INVALID_EMAIL: 'Invalid email',
  SHIFTS_DURATION_LESS_THAN_APPOINTMENT_DURATION:
    'Availability shifts duration could not be less than appointment duration',
  INVALID_PHONE_NUMBER: 'phone must be a phone number',
  USER_IS_NOT_A_FOLLOWER: 'u are not a follower already',
  U_CANT_ENTER_EMPTY_TWITTE: 'U can not enter empty twitte',
  U_CANT_ENTER_EMPTY_COMMENT: 'U can not enter empty comment',
  USER_EMAIL_IS_VERIFIED: 'user is already valid',
};