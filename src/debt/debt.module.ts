import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtorController } from './controller/debtor/debtor.controller';
import { DebtorService } from './service/debtor/debtor.service';
import { Debtor } from 'src/entities/debtors';
import { Secondor } from 'src/entities/secondors';
import { Installment } from 'src/entities/installment';
import { PhoneCallTracker } from 'src/entities/phone_tracker';
import { DocumentTracker } from 'src/entities/document_tracker';
import { OutsourceTracker } from 'src/entities/outsource_tracker';



@Module({
  imports: [TypeOrmModule.forFeature([Debtor,Secondor,Installment,PhoneCallTracker,DocumentTracker,OutsourceTracker])],  
  providers: [DebtorService],
  controllers: [DebtorController]
})
export class DebtModule {}
