import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Debtor } from './debtors';

@Entity()
export class DocumentTracker {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Debtor, debtor => debtor.documentTrackers)
  debtor: Debtor;

  @Column()
  file_document_tracker: string;

  @Column({ type: 'timestamp' })
  time_update: Date;

  @Column('text',{nullable: true})
  response: string;

  @Column('text',{nullable: true})
  comments: string;

}