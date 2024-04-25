
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { PhoneCallTracker } from './phone_tracker';


@Entity()
export class Installment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loan_type: string

  @Column({default: 0})
  installment_number: number;
  
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  loan_date: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  due_date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  debt_amount: number;

  @Column()
  debt_installments: number;

  @Column()
  payment_per_installment: number;

  @Column({nullable: true})
  debt_outstanding: number;

  @Column({nullable: true})
  installments_outstanding: number;
  
  @Column({type:'text',nullable: true})
  comments: string;

}
