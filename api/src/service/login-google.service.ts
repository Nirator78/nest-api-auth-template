import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";
import { LoginService } from "./login.service";
import { LoginGoogleDto } from "../dto/login-google.dto";
import { GoogleOauthConnector } from "../connector/google-oauth.connector";
import { GoogleUserInterface } from "../interface/google-user.interface";
import { AuthType } from "../enum/auth-type";

@Injectable()
export class LoginGoogleService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loginService: LoginService,
    private readonly googleOauthConnector: GoogleOauthConnector,
  ) {}

  async login(loginGoogleDto: LoginGoogleDto) {
    const googleUser: GoogleUserInterface =
      await this.googleOauthConnector.getGoogleUserByCode(loginGoogleDto, AuthType.LOGIN);

    const user = await this.userRepository.getByGoogleId(googleUser.id);

    if (!user) {
      throw new BadRequestException("Error", "User not found");
    } else if (user.banned) {
      throw new BadRequestException("Error", "User banned");
    }

    user.lastConnection = new Date();
    await this.userRepository.save(user);

    return await this.loginService.loginWithUser(user);
  }
}
