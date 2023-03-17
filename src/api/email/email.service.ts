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
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      secure: process.env.MAILER_SECURE, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASSWORD,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: object,
  ): Promise<any> {
    // read the template file
    const html = await this.renderTemplate(template, context);

    // send the email using nodemailer
    return await this.transporter.sendMail({
      from: 'info@maxbbps.com',
      to,
      subject,
      text: 'This is a test email from NestJS',
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
