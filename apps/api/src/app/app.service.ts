import { Injectable } from '@nestjs/common';
import { User } from '@ng-nest-sse/datatypes';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return ({ message: 'Hello Nest API' });
  }
  getUser(): User {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    };
  }
}
