import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDiscordDto } from "../dto/login-discord.dto";
import { UserRepository } from "../repository/user.repository";
import { LoginService } from "./login.service";
import { DiscordOauthConnector } from "../connector/discord-oauth.connector";
import { DiscordUserInterface } from "../interface/discord-user.interface";
import { AuthType } from "../enum/auth-type";

@Injectable()
export class LoginDiscordService {
  constructor(
    private readonly discordOauthConnector: DiscordOauthConnector,
    private readonly userRepository: UserRepository,
    private readonly loginService: LoginService,
  ) {}

  async login(loginDiscordDto: LoginDiscordDto) {
    const discordUser: DiscordUserInterface =
      await this.discordOauthConnector.getDiscordUserByCode(loginDiscordDto, AuthType.LOGIN);

    const user = await this.userRepository.getByDiscordId(discordUser.id);

    if (!user) {
      throw new BadRequestException("Error", "User not found");
    } else if (user.banned) {
      throw new BadRequestException("Error", "User banned");
    }

    user.lastConnection = new Date();
    await this.userRepository.save(user);

    return this.loginService.loginWithUser(user);
  }
}
