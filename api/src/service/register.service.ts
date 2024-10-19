import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "../entity/user";
import { UserRepository } from "../repository/user.repository";

@Injectable()
export class RegisterService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(user: User) {
    // Check if the user already exists
    const userExists = await this.userRepository.getByEmail(user.email);

    if (userExists) {
      throw new BadRequestException("Error", "User already exists");
    }

    return await this.userRepository.save(user);
  }
}
