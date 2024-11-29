import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe, Query, Req } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { StatusEnum } from './enums/status.enum';
import { PaginatedResponse } from './interfaces/paginated-response.interface';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // Créer un todo
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request): Promise<TodoEntity> {
    const userId = req['userId'];
    return await this.todoService.addTodo(createTodoDto, userId);
  }
  
   // Récupérer tous les todos
   @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: StatusEnum,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponse<TodoEntity>> {
    // Validation des paramètres de pagination
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(100, Math.max(1, limit)); // Max 100 items par page

    return await this.todoService.findAll(
      search,
      status,
      validatedPage,
      validatedLimit
    );
  }

   // Récupérer un todo par ID
   @Get(':id')
   async findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoEntity> {
     return await this.todoService.findOne(id);
   }
 
   // Mettre à jour un todo par ID
   @Patch(':id')
   @UsePipes(new ValidationPipe({ transform: true }))
   async update(
     @Param('id', ParseIntPipe) id: number,
     @Body() updateTodoDto: UpdateTodoDto,
   ): Promise<TodoEntity> {
     return await this.todoService.updateTodo(id, updateTodoDto);
   }
 
   // Suppression soft d'un todo par ID
   @Delete(':id')
   async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string; todo: TodoEntity }> {
     return await this.todoService.deleteTodo(id);
   }
 
   // Restauration d'un todo par ID
   @Patch('restore/:id')
   async restore(@Param('id', ParseIntPipe) id: number): Promise<TodoEntity> {
     return await this.todoService.restore(id);
   }
}