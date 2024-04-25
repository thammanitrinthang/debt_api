import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Debtor } from './debtors';

@Entity()
export class OutsourceTracker {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Debtor, debtor => debtor.outsourceTrackers)
  debtor: Debtor;

  @Column()
  username_tracker: string;

  @Column({ type: 'timestamp' })
  time_update: Date;

  @Column('text',{nullable: true})
  response: string;

  @Column('text',{nullable: true})
  comments: string;
}