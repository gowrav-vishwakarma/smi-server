import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailerService } from './email.service';

@Controller()
@ApiTags('Email')
export class MailerController {
  constructor(private readonly MailerService: MailerService) {}
}
