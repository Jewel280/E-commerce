import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(data: { to: string; subject: string; text: string }): Promise<void> {
    await this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      text: data.text,
    });
  }
}