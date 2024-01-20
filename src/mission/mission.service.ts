import { Injectable } from '@nestjs/common';

@Injectable()
export class MissionService {
    getHello(): string {
        return 'Hello World!';
      }
}
