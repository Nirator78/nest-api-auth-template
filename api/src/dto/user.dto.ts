import { IsNotEmpty, IsEmail, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsBoolean()
  receiveNews: boolean;

  @IsOptional()
  @IsBoolean()
  haveFinishPresentation: boolean;
}
