import { TaskPriority } from '@/globals/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  @IsBoolean()
  isCompleted: boolean;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.LOW })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsDate()
  deadline: Date;
}
