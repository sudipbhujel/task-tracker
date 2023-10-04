// validators
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @Length(6, 20)
  @IsString()
  password: string;
}
