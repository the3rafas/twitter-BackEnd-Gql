import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailBoxInput } from './mail.interface';
const nodemailer = require('nodemailer');

@Injectable()
export class NodeMailerService {
  private from: { mail: string; password: string };

  constructor(private readonly configService: ConfigService) {
    const fromEnv = this.configService.get<string>('MAIL_ACCOUNT');
    const fromDetails = (fromEnv || 'email:password').split(':');
    this.from = {
      mail: fromDetails[0],
      password: fromDetails[1],
    };
  }
  // ##################### createtransport  #####################

  async createTranspot() {
    return nodemailer.createTransport({
      // service,
      host: 'smtp.gmail.com',
      secureConnection: false,
      secure: false,
      port: 587,
      auth: {
        user: this.from.mail,
        pass: this.from.password,
      },
    });
  }

  // ##################### send Fun  #####################

  public async send(input: MailBoxInput) {
    const { to, html, subject } = input;

    const transport = await this.createTranspot();

    try {
      await transport.sendMail({
        from: this.from.mail,
        to,
        subject,
        html,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
