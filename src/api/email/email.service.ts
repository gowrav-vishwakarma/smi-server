import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
const path = require('path');

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'info@maxbbps.com',
        pass: 'Shekar@456sw@!sc',
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: object,
  ) {
    // read the template file
    const html = await this.renderTemplate(template, context);

    // send the email using nodemailer
    await this.transporter.sendMail({
      from: 'info@maxbbps.com',
      to,
      subject,
      text: 'This is a test email from NestJS' + html,
      html,
    });
  }

  private async renderTemplate(
    template: string,
    context: object,
  ): Promise<string> {
    // read the template file from disk
    const filePath = path.join(
      __dirname,
      '../../../src/emailTemplate/welcome-template.html',
    );
    const source = fs.readFileSync(filePath, 'utf-8');
    // compile the template using handlebars
    const compiledTemplate = handlebars.compile(source);

    // render the template with the provided context
    return compiledTemplate(context);
  }
}
