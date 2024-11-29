import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { StatusEnum } from './enums/status.enum';
import { PaginatedResponse } from './interfaces/paginated-response.interface';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}
  
  async findAll(
    search?: string,
    status?: StatusEnum,
    page: number = 1,
    limit: number = 3
  ): Promise<PaginatedResponse<TodoEntity>> {
    try {
      const queryBuilder = this.todoRepository.createQueryBuilder('todo');

      // Construction des conditions de recherche
      if (search) {
        queryBuilder.where(
          '(LOWER(todo.name) LIKE LOWER(:search) OR LOWER(todo.description) LIKE LOWER(:search))',
          { search: `%${search}%` }
        );
      }

      if (status) {
        const condition = 'todo.status = :status';
        if (search) {
          queryBuilder.andWhere(condition, { status });
        } else {
          queryBuilder.where(condition, { status });
        }
      }

      // Calcul de l'offset pour la pagination
      const skip = (page - 1) * limit;

      // Compter le total d'éléments avant d'appliquer la pagination
      const total = await queryBuilder.getCount();

      // Ajouter la pagination à la requête
      queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('todo.id', 'DESC'); // Tri par ID décroissant par défaut

      // Exécuter la requête
      const data = await queryBuilder.getMany();

      // Calculer les métadonnées de pagination
      const totalPages = Math.ceil(total / limit);

      return {
        data,
        meta: {
          total,
          currentPage: page,
          itemsPerPage: limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
   async addTodo(createTodoDto: CreateTodoDto,userId: number): Promise<TodoEntity> {
    const newTodo = this.todoRepository.create({
      ...createTodoDto,
      userId, // Ajout automatique de userId
    });
    // Sauvegarde du nouvel enregistrement dans la base de données
    return await this.todoRepository.save(newTodo);
  }
  async findOne(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return todo;
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return await this.todoRepository.save(todo);
  }

  async deleteTodo(id: number): Promise<{ message: string; todo: TodoEntity }> {
    const todo = await this.findOne(id);
    await this.todoRepository.softDelete(id);
    return {
      message: `Todo #${id} has been soft deleted`,
      todo,
    };
  }


  async restore(id: number): Promise<TodoEntity> {
    await this.todoRepository.restore(id);
    return this.findOne(id);
  }

  // For your stats method, use the unwrapped data
  async getStatusCount(): Promise<{ [key in StatusEnum]: number }> {
    console.log('Fetching counts by status...');
    const counts = {
      [StatusEnum.PENDING]: await this.todoRepository.count({ where: { status: StatusEnum.PENDING } }),
      [StatusEnum.IN_PROGRESS]: await this.todoRepository.count({ where: { status: StatusEnum.IN_PROGRESS } }),
      [StatusEnum.DONE]: await this.todoRepository.count({ where: { status: StatusEnum.DONE } }),
    };
    console.log('Counts:', counts);
    return counts;
  }

}
