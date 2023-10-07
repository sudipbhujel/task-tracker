import { OrderBy, SortBy, TaskDeadline, TaskPriority } from '@/globals/enum';
import { BadRequestException } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class TaskQueryDto {
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    description: 'Query',
  })
  q?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    enum: TaskPriority,
    description: 'Task priority',
  })
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    enum: TaskDeadline,
    description: 'Task Deadline',
  })
  @Transform(({ value }) => {
    switch (value) {
      case TaskDeadline.PAST:
        return {
          $lte: new Date(),
        };
      case TaskDeadline.TODAY:
        const gtDate = new Date();
        gtDate.setHours(0, 0, 0, 0);

        const ltDate = new Date();
        ltDate.setHours(23, 59, 59, 999);

        return {
          $gte: gtDate,
          $lte: ltDate,
        };
      case TaskDeadline.FUTURE:
        return {
          $gte: new Date(),
        };
      default:
        throw new BadRequestException('Invalid Task Deadline');
    }
  })
  deadline?: {
    $lte?: Date;
    $gte?: Date;
  };

  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    enum: SortBy,
    description: 'Sort By',
  })
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    enum: OrderBy,
    description: 'Order By',
  })
  @IsEnum(OrderBy)
  orderBy?: OrderBy;
}
