import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtorController } from './controller/debtor/debtor.controller';
import { DebtorService } from './service/debtor/debtor.service';
import { Debtor } from 'src/entities/debtors';
import { Secondor } from 'src/entities/secondors';
import { Installment } from 'src/entities/installment';
import { PhoneCallTracker } from 'src/entities/phone_call_tracker';
import { DocumentTracker } from 'src/entities/document_tracker';
import { OutsourceTracker } from 'src/entities/outsource_tracker';
import { CancelContract } from 'src/entities/cancel_contract';
import { AfterValue } from 'src/entities/after_value';
import { BeforeValue } from 'src/entities/before_value';



@Module({
  imports: [TypeOrmModule.forFeature([
    Debtor,Secondor,Installment,PhoneCallTracker,DocumentTracker,OutsourceTracker,CancelContract,AfterValue,BeforeValue
  ])],  
  providers: [DebtorService],
  controllers: [DebtorController]
})
export class DebtModule {}
