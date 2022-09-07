import { Injectable } from '@nestjs/common';
const { version } = require('../package.json');
@Injectable()
export class AppService {
  getHello(): any {
    return { message: 'Everything looks fine! ', version };
  }
}
