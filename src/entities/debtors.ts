import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Installment } from './installment';
import { Secondor } from './secondors';
import { PhoneCallTracker } from './phone_call_tracker';
import { DocumentTracker } from './document_tracker';
import { OutsourceTracker } from './outsource_tracker';
import { CancelContract } from './cancel_contract';
import { AfterValue } from './after_value';
import { BeforeValue } from './before_value';

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

  @OneToOne(() => Installment, { cascade: true })
  @JoinColumn()
  installment: Installment;
  
  @OneToOne(() => Secondor, { cascade: true })
  @JoinColumn()
  secondor: Secondor;

  @OneToMany(() => PhoneCallTracker, (phone_tracker) => phone_tracker.debtor, { cascade: true })
  phoneCallTrackers: PhoneCallTracker[];

  @OneToMany(() => DocumentTracker, (document_tracker) => document_tracker.debtor, { cascade: true })
  documentTrackers: DocumentTracker[];

  @OneToMany(() => OutsourceTracker, (outsourceTracker) => outsourceTracker.debtor, { cascade: true })
  outsourceTrackers: OutsourceTracker[];

  @OneToMany(() => CancelContract, (cancelContract) => cancelContract.debtor,{ cascade: true })
  cancelContract: CancelContract[];

  @OneToMany(() => AfterValue, (afterValue) => afterValue.debtor,{ cascade: true })
  afterValue:  AfterValue[];

  @OneToMany(() => BeforeValue, (beforeValue) => beforeValue.debtor,{ cascade: true })
  beforeValue:  BeforeValue[];

}
