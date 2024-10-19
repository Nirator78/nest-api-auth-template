import { Injectable } from "@nestjs/common";
import { User } from "../entity/user";
import { RegisterService } from "./register.service";
import { LoginDiscordDto } from "../dto/login-discord.dto";
import { DiscordUserInterface } from "../interface/discord-user.interface";
import { DiscordOauthConnector } from "../connector/discord-oauth.connector";
import { LoginService } from "./login.service";
import { UserRepository } from "../repository/user.repository";
import { AuthType } from "../enum/auth-type";
import { ImageService } from "./image.service";

@Injectable()
export class RegisterDiscordService {
  constructor(
    private readonly discordOauthConnector: DiscordOauthConnector,
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly userRepository: UserRepository,
    private readonly imageService: ImageService,
  ) {}

  async register(loginDiscordDto: LoginDiscordDto) {
    const discordUser: DiscordUserInterface =
      await this.discordOauthConnector.getDiscordUserByCode(
        loginDiscordDto,
        AuthType.REGISTER,
      );

    const userExists = await this.userRepository.getByDiscordId(discordUser.id);
    if (userExists) {
      return await this.loginService.loginWithUser(userExists);
    }

    const newUser = new User();
    newUser.discordId = discordUser.id;
    newUser.email = discordUser.email;
    newUser.username = discordUser.username;
    newUser.emailDiscord = discordUser.email;
    newUser.createdAt = new Date();
    newUser.lastConnection = new Date();

    const user = await this.registerService.register(newUser);

    const image = await this.imageService.createForDiscord(
      user,
      discordUser.id,
      discordUser.avatar,
    );
    if (image) {
      user.image = image;
      await this.userRepository.save(user);
    }

    return await this.loginService.loginWithUser(user);
  }
}
