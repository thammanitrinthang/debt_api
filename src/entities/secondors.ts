
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';


@Entity()
export class Secondor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username_seconder: string;

  @Column()
  telephone_number_seconder: string;

  @Column()
  address_current: string;

  @Column()
  address_contract: string;

}
