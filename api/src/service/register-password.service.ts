import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "../entity/user";
import { RegisterService } from "./register.service";
import { LoginService } from "./login.service";
import { RegisterPasswordDto } from "../dto/register-password.dto";
import { UserRepository } from "../repository/user.repository";

@Injectable()
export class RegisterPasswordService {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(registerPasswordDto: RegisterPasswordDto) {
    const userExists = await this.userRepository.getByEmail(
      registerPasswordDto.email,
    );
    if (userExists) {
      throw new BadRequestException("Error", "User already exists");
    }

    const newUser = new User();
    newUser.email = registerPasswordDto.email;
    newUser.username = registerPasswordDto.username;

    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(registerPasswordDto.password, salt);

    newUser.createdAt = new Date();
    newUser.lastConnection = new Date();

    const user = await this.registerService.register(newUser);

    return await this.loginService.loginWithUser(user);
  }
}
