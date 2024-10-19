import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Image } from "../entity/image";

@Injectable()
export class ImageRepository {
  private readonly logger = new Logger("ImageRepository");
  private readonly relations = ["user"];

  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async getById(id: number): Promise<Image> {
    return await this.imageRepository.findOne({
      where: { id },
    });
  }

  async save(image: Image): Promise<Image> {
    return await this.imageRepository.save(image);
  }
}
