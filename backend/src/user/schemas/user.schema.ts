import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

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
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, index: 'text' })
  email: string;

  @Prop({ type: String, required: true })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
