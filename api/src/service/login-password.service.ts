import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../repository/user.repository";
import { LoginService } from "./login.service";
import { LoginPasswordDto } from "../dto/login-password.dto";

@Injectable()
export class LoginPasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly loginService: LoginService,
  ) {}

  async login(loginPasswordDto: LoginPasswordDto) {
    const user = await this.userRepository.getByEmail(loginPasswordDto.email);

    if (!user) {
      throw new BadRequestException("Error", "Invalid credentials");
    } else if (user.banned) {
      throw new BadRequestException("Error", "User banned");
    } else if (!user.password) {
      throw new BadRequestException("Error", "Invalid credentials");
    }

    const testPassword = await bcrypt.compare(
      loginPasswordDto.password,
      user.password,
    );

    if (!testPassword) {
      throw new BadRequestException("Error", "Invalid credentials");
    }

    user.lastConnection = new Date();
    await this.userRepository.save(user);

    return this.loginService.loginWithUser(user);
  }
}
