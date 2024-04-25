import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Installment } from './installment';
import { Secondor } from './secondors';
import { PhoneCallTracker } from './phone_tracker';
import { DocumentTracker } from './document_tracker';
import { OutsourceTracker } from './outsource_tracker';

@Entity()
export class Debtor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  contract_id: string;

  @Column()
  username: string;

  @Column()
  telephone_number: string;

  @Column()
  address_current: string;

  @Column()
  address_contract: string;

  @OneToOne(() => Installment , { cascade: true })
  @JoinColumn()
  installment: Installment;
  
  @OneToOne(() => Secondor , { cascade: true })
  @JoinColumn()
  secondor: Secondor;

  @OneToMany(()=> PhoneCallTracker,(phone_tracker)=>phone_tracker.debtor, { cascade: true })
  phoneCallTrackers:PhoneCallTracker[];

  @OneToMany(()=> DocumentTracker ,(document_tracker)=>document_tracker.debtor, { cascade: true })
  documentTrackers:DocumentTracker[];

  @OneToMany(() => OutsourceTracker, outsourceTracker => outsourceTracker.debtor)
  outsourceTrackers: OutsourceTracker[];

}