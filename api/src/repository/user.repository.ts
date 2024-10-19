import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/user";
import { AuthService } from "../service/auth.service";
import { UserDto } from "../dto/user.dto";

@Injectable()
export class UserRepository {
  private readonly logger = new Logger("UserRepository");
  private readonly relations = [
    "currentEnroll",
    "currentEnroll.offre",
    "currentEnroll.offre.offreFunctionalities",
    "currentEnroll.offre.offreFunctionalities.functionality",
    "userQuizPsychologique",
    "qualifiantProfilePsychologique",
    "qualifiantProfilePsychologique.image",
    "image",
  ];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: this.relations,
    });

    if (!user) {
      throw new BadRequestException("Error", "User not found");
    }

    return user;
  }

  async getByDiscordId(discordId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { discordId },
      relations: this.relations,
    });
  }

  async getByGoogleId(googleId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { googleId },
      relations: this.relations,
    });
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getMe(headers: any): Promise<User> {
    // On récupère les infos du token
    const tokenInfos = await this.authService.getTokenInfosInHeaders(headers);

    // Via l'id de l'utilisateur dans le token on récupère l'utilisateur en base de donnée
    // On retourne l'utilisateur avec les vidéos et guides finis
    return await this.getById(tokenInfos.id);
  }

  async patchMe(headers: any, userDto: UserDto): Promise<User> {
    const user = await this.getMe(headers);

    if (!user) {
      throw new BadRequestException("Error", "User not found");
    }

    user.username = userDto.username;
    user.email = userDto.email;

    return await this.save(user);
  }
}
