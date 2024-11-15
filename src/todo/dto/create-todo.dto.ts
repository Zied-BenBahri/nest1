import { IsNotEmpty, IsString, MinLength, MaxLength,IsEnum  } from 'class-validator';
import { ErrorMessages } from '../../common/constants/error-messages';
import { StatusEnum } from '../enums/status.enum';

export class CreateTodoDto {
  @IsNotEmpty({ message: ErrorMessages.TODO_NAME_REQUIRED })
  @IsString()
  @MinLength(3, { message: ErrorMessages.TODO_NAME_MIN_LENGTH })
  @MaxLength(10, { message: ErrorMessages.TODO_NAME_MAX_LENGTH })
  name: string;

  @IsNotEmpty({ message: ErrorMessages.TODO_DESCRIPTION_REQUIRED })
  @IsString()
  @MinLength(10, { message: ErrorMessages.TODO_DESCRIPTION_MIN_LENGTH })
  description: string;

  
  @IsEnum(StatusEnum, { message: ErrorMessages.TODO_STATUS_INVALID })
  status: StatusEnum;
}