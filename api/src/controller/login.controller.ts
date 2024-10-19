import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { LoginPasswordDto } from "../dto/login-password.dto";
import { LoginPasswordService } from "../service/login-password.service";
import { LoginDiscordService } from "../service/login-discord.service";
import { LoginGoogleService } from "../service/login-google.service";
import { LoginDiscordDto } from "../dto/login-discord.dto";
import { LoginGoogleDto } from "../dto/login-google.dto";

@Controller("login")
export class LoginController {
  constructor(
    private readonly loginPasswordService: LoginPasswordService,
    private readonly loginDiscordService: LoginDiscordService,
    private readonly loginGoogleService: LoginGoogleService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/password")
  loginWithPassword(@Body() loginPasswordDto: LoginPasswordDto): any {
    return this.loginPasswordService.login(loginPasswordDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/discord")
  loginWithDiscord(@Body() LoginDiscordDto: LoginDiscordDto): any {
    return this.loginDiscordService.login(LoginDiscordDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("/google")
  loginWithGoogle(@Body() loginGoogleDto: LoginGoogleDto): any {
    return this.loginGoogleService.login(loginGoogleDto);
  }
}
