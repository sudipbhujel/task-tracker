import { UserDocument } from '@/user/schemas/user.schema';

import { Expose, Transform } from 'class-transformer';

export class MeEntity implements Partial<UserDocument> {
  @Expose()
  @Transform(({ value }) => {
    if (!value) return value;
    return value.toString();
  })
  id: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  email: string;

  @Expose()
  fullName?: string;

  @Expose({ name: 'fullName' })
  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  @Expose()
  token?: string | null;

  constructor(user: Partial<UserDocument>) {
    Object.assign(this, user);
  }
}
