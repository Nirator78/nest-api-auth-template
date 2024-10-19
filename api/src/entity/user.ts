import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Image } from "./image";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: "ID" })
  id: number;

  @Column({ nullable: true, name: "USERNAME" })
  username: string;

  @Column({ nullable: true, name: "EMAIL_DISCORD" })
  emailDiscord: string;

  @Column({ nullable: true, name: "EMAIL_STRIPE" })
  emailStripe: string;

  @Column({ nullable: true, name: "EMAIL_GOOGLE" })
  emailGoogle: string;

  @Column({ nullable: true, name: "EMAIL" })
  email: string;

  @Exclude()
  @Column({ nullable: true, name: "PASSWORD" })
  password: string;

  @Column({ nullable: true, name: "DISCORD_ID" })
  discordId: string;

  @Column({ nullable: true, name: "GOOGLE_ID" })
  googleId: string;

  @Column({ default: false, name: "BANNED" })
  banned: boolean;

  @CreateDateColumn({
    nullable: false,
    name: "CREATED_AT",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @CreateDateColumn({
    nullable: false,
    name: "LAST_CONNECTION",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  lastConnection: Date;

  @Column({ nullable: true, type: "text", name: "NOTE" })
  note: string;

  @ManyToOne(() => Image, (image) => image.id)
  @JoinColumn({ name: "IMAGE_ID" })
  image: Image;
}
