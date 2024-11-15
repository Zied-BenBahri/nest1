import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo/entities/todo.entity';
import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';
import { CommonService } from './common/common.service';
import { TodoModule } from './todo/todo.module';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';
import { TodoStatsController } from './todo/controllers/todo-stats.controller';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [TodoEntity],
    synchronize: true, // N'utilisez pas cette option en production !
  }),TypeOrmModule.forFeature([TodoEntity])
,TestModule,CommonModule, TodoModule],
controllers: [AppController,TestController,TodoController],
providers: [AppService,TestService,CommonService,TodoService],
  
})
export class AppModule {}
