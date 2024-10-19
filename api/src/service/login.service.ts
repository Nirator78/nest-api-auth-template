import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entity/user";

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService) {}

  async loginWithUser(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      user: payload,
      token: this.jwtService.sign(payload),
    };
  }
}
