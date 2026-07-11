import { Injectable } from '@nestjs/common';
import { WelcomeResponseDto } from './dto/welcome-response.dto';

@Injectable()
export class WelcomeService {
  getWelcomeMessage(): WelcomeResponseDto {
    return new WelcomeResponseDto('Hello, World!');
  }
}
