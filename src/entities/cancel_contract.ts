
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Debtor } from './debtors';
import { AfterValue } from './after_value';
import { BeforeValue } from './before_value';


@Entity()
export class CancelContract {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Debtor, debtor => debtor.cancelContract)
  debtor: Debtor;

  @Column()
  type_item: string;

  @Column('text',{nullable: true})
  response: string;

  @Column('text',{nullable: true})
  comments: string;

}
