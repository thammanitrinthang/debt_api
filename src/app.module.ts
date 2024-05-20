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
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [
        Debtor, Secondor, Installment, PhoneCallTracker, DocumentTracker, OutsourceTracker, CancelContract, AfterValue, BeforeValue, User
      ],
      synchronize: true,
    }),
    DebtModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}