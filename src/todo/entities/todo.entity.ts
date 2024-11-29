import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { StatusEnum } from '../enums/status.enum';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('todos')
export class TodoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  
  userId: number; // Identifiant de l'utilisateur créateur du todo
  
  @Column()
  name: string;

  @Column()
  description: string;
  /*
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn({ update: false })
  createdAt: Date;
  */
  @Column({
    type: 'simple-enum', // Utilisation de 'simple-enum' au lieu de 'enum'
    enum: StatusEnum,
    default: StatusEnum.PENDING
  })
  status: String;
}