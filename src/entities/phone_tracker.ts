import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Debtor } from './debtors';


@Entity()
export class PhoneCallTracker {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Debtor, debtor => debtor.phoneCallTrackers)
  debtor: Debtor;

  @Column()
  username_tracker: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time_update: Date;

  @Column('text',{nullable: true})
  response: string;

  @Column('text',{nullable: true})
  comments: string;
}