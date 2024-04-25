import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtModule } from './debt/debt.module';
import { Debtor } from './entities/debtors';
import { Secondor } from './entities/secondors';
import { Installment } from './entities/installment';
import { PhoneCallTracker } from './entities/phone_tracker';
import { DocumentTracker } from './entities/document_tracker';
import { OutsourceTracker } from './entities/outsource_tracker';


@Module({
  imports: [ 
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'debt_database',
    entities: [
      Debtor,Secondor,Installment,PhoneCallTracker,DocumentTracker,OutsourceTracker
    ],
    synchronize: true,
  }), DebtModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}