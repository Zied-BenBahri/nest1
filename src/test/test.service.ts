import { Injectable } from '@nestjs/common';
import { CommonService } from '../common/common.service';

@Injectable()
export class TestService {
  constructor(private readonly commonService: CommonService) {}

 /* testUuidGeneration(): string {
    return this.commonService.generateUuid();
  }*/
}
