import { Controller, Get } from '@nestjs/common';
import { TodoService } from '../todo.service';
import { StatusEnum } from '../enums/status.enum';

@Controller('todo-stats')
export class TodoStatsController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async StatusCount(): Promise<{ [key in StatusEnum]: number }> {
    return this.todoService.getStatusCount();
  }
}
