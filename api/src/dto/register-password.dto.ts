import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
