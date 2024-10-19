import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { BucketType } from "../enum/bucket-type";
import { User } from "./user";

@Entity()
export class Image {
  @PrimaryGeneratedColumn({ name: "ID" })
  id: number;

  @Exclude()
  @Column({ nullable: false, name: "NAME" })
  name: string;

  @Exclude()
  @Column({ nullable: false, name: "BUCKET", type: "enum", enum: BucketType })
  bucket: BucketType;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "USER_ID" })
  user: User;
}
