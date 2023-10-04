// packages
import { Expose } from 'class-transformer';

export class MessageEntity {
  @Expose()
  message: string;

  constructor(message: string) {
    Object.assign(this, { message });
  }
}
