import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtModule } from './debt/debt.module';
import { Debtor } from './entities/debtors';
import { Secondor } from './entities/secondors';
import { Installment } from './entities/installment';
import { PhoneCallTracker } from './entities/phone_call_tracker';
import { DocumentTracker } from './entities/document_tracker';
import { OutsourceTracker } from './entities/outsource_tracker';
import { CancelContract } from './entities/cancel_contract';
import { BeforeValue } from './entities/before_value';
import { AfterValue } from './entities/after_value';
import { User } from './user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {JwtModule} from "@nestjs/jwt";


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
      Debtor,Secondor,Installment,PhoneCallTracker,DocumentTracker,OutsourceTracker,CancelContract,AfterValue,BeforeValue,User
    ],
    synchronize: true,
  }), DebtModule, 
  TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: 'secret',
            signOptions: {expiresIn: '1d'}
        })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}