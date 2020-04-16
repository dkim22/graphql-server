import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  // 이메일을 unique: true로 하지 않는 이유는 다음에 폰 넘버가 들어와서 중복이메일을 받을 수 있기 때문에 뮤테이션에서 처리 할 예정
  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Column("text")
  password: string;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
