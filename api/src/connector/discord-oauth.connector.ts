import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { LoginDiscordDto } from "../dto/login-discord.dto";
import { DiscordUserInterface } from "../interface/discord-user.interface";
import { ConfigurationRepository } from "../repository/configuration.repository";
import { AuthType } from "../enum/auth-type";

@Injectable()
export class DiscordOauthConnector {
  constructor(
    private readonly configurationRepository: ConfigurationRepository,
    private readonly http: HttpService,
  ) {}

  async getDiscordUserByCode(
    loginDiscordDto: LoginDiscordDto,
    mode: AuthType,
  ): Promise<DiscordUserInterface> {
    const body = new URLSearchParams({
      client_id:
        await this.configurationRepository.getByKey("discord.client_id"),
      client_secret: await this.configurationRepository.getByKey(
        "discord.client_secret",
      ),
      code: loginDiscordDto.code,
      grant_type: "authorization_code",
      redirect_uri:
        await this.configurationRepository.getByKey("discord.redirect." + mode),
      scope: "identify email",
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const discordToken = await this.http
      .post("https://discord.com/api/oauth2/token", body, { headers })
      .toPromise();
    const discordOauthData = discordToken.data;

    const discordMeResponse: any = await this.http
      .get("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${discordOauthData.token_type} ${discordOauthData.access_token}`,
        },
      })
      .toPromise();
    const discordUser: DiscordUserInterface = discordMeResponse.data;

    return discordUser;
  }
}
