import { TaskPriority } from '@/globals/enum';
import { TaskDocument } from '@/task/schemas/task.schema';
import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';

export class TaskEntity implements Partial<TaskDocument> {
  @Expose()
  @Transform(({ value }) => {
    if (!value) return value;
    return value.toString();
  })
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date | null;

  @Expose()
  isDeleted: boolean;

  @Expose()
  isCompleted: boolean;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;

  @Expose()
  deadline: Date;

  @Expose()
  @Transform(({ value }) => {
    if (!value) return value;
    return value.toString();
  })
  userId: string;

  constructor(task: Partial<TaskDocument>) {
    Object.assign(this, task);
  }
}
