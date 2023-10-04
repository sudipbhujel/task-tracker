import { TaskPriority } from '@/globals/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
  toJSON: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(_doc, ret, _options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
    virtuals: true,
  },
  toObject: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(_doc, ret, _options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
    virtuals: true,
  },
})
export class Task {
  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, enum: TaskPriority, required: true })
  priority: TaskPriority;

  @Prop({ type: Date, required: true })
  deadline: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;
}

const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

export { TaskSchema };
