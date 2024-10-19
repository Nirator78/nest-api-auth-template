import { IsNotEmpty } from "class-validator";

export class LoginDiscordDto {
  @IsNotEmpty()
  code: string;
}
