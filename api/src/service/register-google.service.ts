import { Injectable } from "@nestjs/common";
import { User } from "../entity/user";
import { RegisterService } from "./register.service";
import { LoginGoogleDto } from "../dto/login-google.dto";
import { GoogleUserInterface } from "../interface/google-user.interface";
import { GoogleOauthConnector } from "../connector/google-oauth.connector";
import { LoginService } from "./login.service";
import { UserRepository } from "../repository/user.repository";
import { AuthType } from "../enum/auth-type";
import { ImageService } from "./image.service";

@Injectable()
export class RegisterGoogleService {
  constructor(
    private readonly googleOauthConnector: GoogleOauthConnector,
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly userRepository: UserRepository,
    private readonly imageService: ImageService,
  ) {}

  async register(loginGoogleDto: LoginGoogleDto) {
    const googleUser: GoogleUserInterface =
      await this.googleOauthConnector.getGoogleUserByCode(
        loginGoogleDto,
        AuthType.REGISTER,
      );

    const userExists = await this.userRepository.getByGoogleId(googleUser.id);
    if (userExists) {
      return await this.loginService.loginWithUser(userExists);
    }

    const newUser = new User();
    newUser.googleId = googleUser.id;
    newUser.email = googleUser.email;
    newUser.emailGoogle = googleUser.email;
    newUser.username = googleUser.name;
    newUser.createdAt = new Date();
    newUser.lastConnection = new Date();

    const user = await this.registerService.register(newUser);

    const image = await this.imageService.createForGoogle(
      user,
      googleUser.picture,
    );
    if (image) {
      user.image = image;
      await this.userRepository.save(user);
    }

    return await this.loginService.loginWithUser(user);
  }
}
