import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { LoginGoogleDto } from "../dto/login-google.dto";
import { ConfigurationRepository } from "../repository/configuration.repository";
import { GoogleUserInterface } from "../interface/google-user.interface";
import { AuthType } from "../enum/auth-type";

@Injectable()
export class GoogleOauthConnector {
  constructor(
    private readonly configurationRepository: ConfigurationRepository,
    private readonly http: HttpService,
  ) {}

  async getGoogleUserByCode(
    loginGoogleDto: LoginGoogleDto,
    mode: AuthType,
  ): Promise<GoogleUserInterface> {
    const body = new URLSearchParams({
      client_id:
        await this.configurationRepository.getByKey("google.client_id"),
      client_secret: await this.configurationRepository.getByKey(
        "google.client_secret",
      ),
      code: loginGoogleDto.code,
      grant_type: "authorization_code",
      redirect_uri:
        await this.configurationRepository.getByKey("google.redirect." + mode),
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const googleToken = await this.http
      .post("https://www.googleapis.com/oauth2/v4/token", body, { headers })
      .toPromise();
    const googleOauthData = googleToken.data;

    const googleMeResponse: any = await this.http
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          authorization: `Bearer ${googleOauthData.access_token}`,
        },
      })
      .toPromise();
    const googleUser: GoogleUserInterface = googleMeResponse.data;

    return googleUser;
  }
}
