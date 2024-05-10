import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { CancelContract } from './cancel_contract';
import { Debtor } from './debtors';

@Entity()
export class BeforeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name_value: string;

  @Column()
  price_value: number;

  @ManyToOne(() => Debtor, debtor => debtor.beforeValue)
  debtor: Debtor;
}
