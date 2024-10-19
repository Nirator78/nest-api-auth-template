import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Configuration } from "../entity/configuration";
import { LessThan, Repository } from "typeorm";

@Injectable()
export class ConfigurationRepository {
  private readonly logger = new Logger("ConfigurationRepository");

  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) {}

  async getByKey(key: string): Promise<string> {
    const configuration = await this.configurationRepository.findOne({
      where: { key },
    });

    if (!configuration) {
      this.logger.error(`Configuration with key ${key} not found`);
    }

    if (!configuration.active) {
      this.logger.error(`Configuration with key ${key} is not active`);
    }

    return configuration.value;
  }

  async getExipredInOneWeek(): Promise<Configuration[]> {
    const nowMore7Day = new Date();
    nowMore7Day.setDate(nowMore7Day.getDate() + 7);

    return await this.configurationRepository.find({
      where: {
        end_date: LessThan(nowMore7Day),
        active: true,
      },
    });
  }
}
