import { BadRequestException, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import * as keygenerator from "keygenerator";
import { ImageRepository } from "../repository/image.repository";
import { Image } from "../entity/image";
import { BucketType } from "../enum/bucket-type";
import { AuthService } from "./auth.service";
import { UserRepository } from "../repository/user.repository";
import { User } from "../entity/user";

@Injectable()
export class ImageService {
  private readonly uploadDirectory = join(process.cwd(), "upload");
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async getById(id: number, headers: any, response: any): Promise<void> {
    const image = await this.imageRepository.getById(id);

    if (!image) {
      throw new BadRequestException("Error", "Image not found");
    }

    const userInToken = await this.authService.getTokenInfosInHeaders(headers);
    const user = await this.userRepository.getById(userInToken.id);
    if (image.user) {
      if (image.user.id !== user.id) {
        throw new BadRequestException(
          "Error",
          "You are not allowed to access this resource",
        );
      }
    }

    const url = join(image.bucket, image.name);
    const data = readFileSync(join(this.uploadDirectory, url));
    response.contentType("image/png");
    response.send(data);
  }

  async createForDiscord(
    user: User,
    discordId: string,
    avatarId: string,
  ): Promise<Image> {
    try {
      // Get image from discord api
      const filename = avatarId + ".png";
      const baseUrl =
        "https://cdn.discordapp.com/avatars/" + discordId + "/" + filename;

      const response = await this.httpService
        .get(baseUrl, { responseType: "arraybuffer" })
        .toPromise();
      const data = response.data;

      const directory = join(this.uploadDirectory, BucketType.USER);
      this.createDirectory(directory);
      writeFileSync(join(directory, filename), data, "base64");

      // Save image to disk
      const newImage = new Image();
      newImage.bucket = BucketType.USER;
      newImage.name = filename;
      newImage.user = user;

      return this.imageRepository.save(newImage);
    } catch (e) {
      console.log(e);
    }
  }

  async createForGoogle(user: User, pictureUrl: string): Promise<Image> {
    try {
      const response = await this.httpService
        .get(pictureUrl, { responseType: "arraybuffer" })
        .toPromise();
      const data = response.data;

      const filename = keygenerator.session_id() + ".png";

      const directory = join(this.uploadDirectory, BucketType.USER);
      this.createDirectory(directory);
      writeFileSync(join(directory, filename), data, "base64");

      // Save image to disk
      const newImage = new Image();
      newImage.bucket = BucketType.USER;
      newImage.name = filename;
      newImage.user = user;

      return this.imageRepository.save(newImage);
    } catch (e) {
      console.log(e);
    }
  }

  createDirectory(path: string) {
    mkdirSync(path, { recursive: true });
  }

  async uploadUserAvatar(
    header: any,
    file: Express.Multer.File,
  ): Promise<Image> {
    const userInToken = await this.authService.getTokenInfosInHeaders(header);
    const user: any = await this.userRepository.getById(userInToken.id);

    const filename = keygenerator.session_id() + ".png";

    const directory = join(this.uploadDirectory, BucketType.USER);
    this.createDirectory(directory);
    writeFileSync(join(directory, filename), file.buffer, "base64");

    const newImage = new Image();
    newImage.bucket = BucketType.USER;
    newImage.name = filename;
    newImage.user = user;

    const image = await this.imageRepository.save(newImage);

    user.image = image.id;

    await this.userRepository.save(user);

    return image;
  }
}
