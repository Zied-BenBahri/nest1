import { Controller, Get } from '@nestjs/common';
import { TodoService } from '../todo.service';
import { StatusEnum } from '../enums/status.enum';

@Controller('todo-stats')  // Note the different base route
export class TodoStatsController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getStatusCount(): Promise<{ [key in StatusEnum]: number }> {
    const counts: { [key in StatusEnum]: number } = {
      [StatusEnum.PENDING]: 0,
      [StatusEnum.IN_PROGRESS]: 0,
      [StatusEnum.DONE]: 0
    };

    const todos = await this.todoService.findAll();
    
    todos.forEach(todo => {
      counts[todo.status as StatusEnum] = (counts[todo.status as StatusEnum] || 0) + 1;
    });

    return counts;
  }
}
