import { JwtAuthGuard, User, UserContext } from '@/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskQueryDto } from './dtos/task-query.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() body: CreateTaskDto, @UserContext() user: User) {
    const task = await this.taskService.create({ ...body, userId: user.id });
    return new TaskEntity(task);
  }

  @Get()
  async findAll(@Query() query: TaskQueryDto, @UserContext() user: User) {
    const tasks = await this.taskService.findAll({
      ...query,
      userId: user.id,
      isDeleted: false,
    });

    return tasks.map((task) => new TaskEntity(task));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    return new TaskEntity(task);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.update(id, updateTaskDto);

    return new TaskEntity(task);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const task = await this.taskService.remove(id);

    return new TaskEntity(task);
  }
}
