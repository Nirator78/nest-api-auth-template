import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn({ name: "ID" })
  id: number;

  @Column({ nullable: false, name: "KEY" })
  key: string;

  @Column({ nullable: false, type: "longtext", name: "VALUE" })
  value: string;

  @Column({ nullable: false, name: "ACTIVE" })
  active: boolean;

  @Column({ nullable: true, name: "END_DATE" })
  end_date: Date;
}
