import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { LoginDiscordDto } from "../dto/login-discord.dto";
import { LoginGoogleDto } from "../dto/login-google.dto";
import { RegisterPasswordDto } from "../dto/register-password.dto";
import { RegisterPasswordService } from "../service/register-password.service";
import { RegisterDiscordService } from "../service/register-discord.service";
import { RegisterGoogleService } from "../service/register-google.service";

@Controller("register")
export class RegisterController {
  constructor(
    private readonly registerPasswordService: RegisterPasswordService,
    private readonly registerDiscordService: RegisterDiscordService,
    private readonly registerGoogleService: RegisterGoogleService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/password")
  registerWithPassword(@Body() registerPasswordDto: RegisterPasswordDto): any {
    return this.registerPasswordService.register(registerPasswordDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/discord")
  registerWithDiscord(@Body() LoginDiscordDto: LoginDiscordDto): any {
    return this.registerDiscordService.register(LoginDiscordDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/google")
  registerWithGoogle(@Body() loginGoogleDto: LoginGoogleDto): any {
    return this.registerGoogleService.register(loginGoogleDto);
  }
}
