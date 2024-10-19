import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
