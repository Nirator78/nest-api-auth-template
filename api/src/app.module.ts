import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";

// * Controller
import { LoginController } from "./controller/login.controller";
import { RegisterController } from "./controller/register.controller";
// * Entity
import { Configuration } from "./entity/configuration";
import { Image } from "./entity/image";
import { User } from "./entity/user";
// * Connector
import { DiscordOauthConnector } from "./connector/discord-oauth.connector";
import { GoogleOauthConnector } from "./connector/google-oauth.connector";
// * Repository
import { ConfigurationRepository } from "./repository/configuration.repository";
import { ImageRepository } from "./repository/image.repository";
import { UserRepository } from "./repository/user.repository";
// * Service
import { AuthService } from "./service/auth.service";
import { ImageService } from "./service/image.service";
import { LoginService } from "./service/login.service";
import { LoginPasswordService } from "./service/login-password.service";
import { LoginDiscordService } from "./service/login-discord.service";
import { LoginGoogleService } from "./service/login-google.service";
import { RegisterService } from "./service/register.service";
import { RegisterPasswordService } from "./service/register-password.service";
import { RegisterDiscordService } from "./service/register-discord.service";
import { RegisterGoogleService } from "./service/register-google.service";
// * Strategy
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        autoLoadEntities: true,
        synchronize: true,
        charset: "utf8mb4",
        collation: "utf8mb4_unicode_ci",
      }),
    }),
    TypeOrmModule.forFeature([
      // * Entity
      Configuration,
      Image,
      User,
    ]),
    HttpModule,
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("ENCRCYPT_TOKEN"),
        signOptions: {
          expiresIn: configService.get("DURATION_VALIDITY"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LoginController, RegisterController],
  providers: [
    // * Connector
    DiscordOauthConnector,
    GoogleOauthConnector,
    // * Repository
    ConfigurationRepository,
    ImageRepository,
    UserRepository,
    // * Service
    AuthService,
    ImageService,
    LoginService,
    LoginPasswordService,
    LoginDiscordService,
    LoginGoogleService,
    RegisterService,
    RegisterPasswordService,
    RegisterDiscordService,
    RegisterGoogleService,
    // * Strategy
    JwtStrategy,
  ],
})
export class AppModule {}
