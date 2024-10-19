import { IsNotEmpty } from 'class-validator';

export class LoginGoogleDto {
  @IsNotEmpty()
  code: string;
}
