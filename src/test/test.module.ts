import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { CommonService } from 'src/common/common.service';

@Module({
  providers: [TestService,CommonService],
  controllers: [TestController]
})
export class TestModule {}
