import { Controller, Get } from '@nestjs/common';
import { WelcomeService } from './welcome.service';
import { WelcomeResponseDto } from './dto/welcome-response.dto';

@Controller('welcome')
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Get()
  getWelcome(): WelcomeResponseDto {
    return this.welcomeService.getWelcomeMessage();
  }
}
