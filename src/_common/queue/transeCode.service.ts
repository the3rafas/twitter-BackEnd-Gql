import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import Bull, { Queue } from 'bull';

import { TRANS_CODE } from './constant';

@Injectable()
export class TransCodeService {
  constructor(
    @InjectQueue(TRANS_CODE) private readonly transCodeQueue: Queue,
  ) {}
  async addQueue(
    fileName: string,
    fun: Promise<Boolean>,
    opt?: Bull.JobOptions,
  ) {
    console.log('ee');

    try {
      const job = await this.transCodeQueue.add(
        'mail',
        {
          fileName,
          fun,
        },
        opt,
      );
    } catch (err) {
      console.log('err');
    }
  }
}
 