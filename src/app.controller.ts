import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getPublicPage(): string {
    return 'It\'s public page';
  }

  @Get('/private')
  getPrivatePage(): string {
    return 'It\'s private page';
  }
}
