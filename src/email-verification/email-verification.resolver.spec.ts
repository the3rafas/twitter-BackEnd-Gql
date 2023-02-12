import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationResolver } from './email-verification.resolver';

describe('EmailVerificationResolver', () => {
  let resolver: EmailVerificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailVerificationResolver],
    }).compile();

    resolver = module.get<EmailVerificationResolver>(EmailVerificationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
