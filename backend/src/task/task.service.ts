import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Task, TaskDocument } from './schemas/task.schema';
import { TaskQueryDto } from './dtos/task-query.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(data: Partial<Task>): Promise<Task> {
    const task = new this.taskModel(data);

    return (await task.save())?.toObject();
  }

  async findAll(where: TaskQueryDto): Promise<Task[]> {
    return (await this.taskModel.find(where).exec()).map(
      (item) => item?.toObject(),
    );
  }

  async findOne(id: string) {
    return (
      await this.taskModel.findOne({ _id: id, isDeleted: false }).exec()
    )?.toObject();
  }

  async update(id: string, updateSupportDto: UpdateTaskDto) {
    return (
      await this.taskModel
        .findOneAndUpdate({ _id: id, isDeleted: false }, updateSupportDto, {
          new: true,
        })
        .exec()
    )?.toObject();
  }

  async remove(id: string) {
    // Soft delete
    return (
      await this.taskModel
        .findByIdAndUpdate(
          id,
          { deletedAt: new Date(), isDeleted: true },
          { new: true },
        )
        .exec()
    )?.toObject();
  }
}
