import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TRANS_CODE } from './constant';
import { Logger } from '@nestjs/common';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';

@Processor(TRANS_CODE)
export class TransCodeConsumer {
  private readonly logger = new Logger(TransCodeConsumer.name);

  @Process('mail')
  async sayHellow(job: Job) {

    this.logger.log(`starting  job ${job.id}`);
    // this.logger.debug('data', job.data);
    await job.data.fun; 
    this.logger.log(`job finished ............`);
  }
}  
  