  import { Get, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
  import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateAfterValueDto, CreateBeforeValueDto, UpdateAfterValueDto, UpdateBeforeValueDto, UpdateCancelContractDto } from 'src/dtos/CancelContract.dto';
  import { UpdateDocumentTrackerDto } from 'src/dtos/Document_tracker.dto';
  import { CreateInstallmentDto } from 'src/dtos/Installment.dto';
  import { UpdateOutsourceTrackerDto } from 'src/dtos/Outsource_tracker.dto';
  import { CreatePhoneTrackerDto, UpdatePhoneTrackerDto } from 'src/dtos/Phone_tracker.dto';
import { AfterValue } from 'src/entities/after_value';
import { BeforeValue } from 'src/entities/before_value';
import { CancelContract } from 'src/entities/cancel_contract';
  import { Debtor } from 'src/entities/debtors';
  import { DocumentTracker } from 'src/entities/document_tracker';
  import { Installment } from 'src/entities/installment';
  import { OutsourceTracker } from 'src/entities/outsource_tracker';
  import { PhoneCallTracker } from 'src/entities/phone_call_tracker';
  import { Secondor } from 'src/entities/secondors';
  import { CreateAfterValueParams, CreateBeforeValueParams, CreateCancelContractParams, CreateDocumentTrackerParams, CreateOutsourceTrackerParams, CreatePhoneTrackerParams } from 'src/utils/types';
  import { EntityManager, FindManyOptions, Repository } from 'typeorm';

  @Injectable()
  export class DebtorService {

      constructor(
          @InjectRepository(Debtor) private debtorRepository: Repository<Debtor>,
          @InjectRepository(Secondor) private secondorRepository: Repository<Secondor>,
          @InjectRepository(Installment) private installmentRepository: Repository<Installment>,
          @InjectRepository(PhoneCallTracker) private phoneTrackerRepository: Repository<PhoneCallTracker>,
          @InjectRepository(DocumentTracker) private documentTrackerRepository: Repository<DocumentTracker>,
          @InjectRepository(OutsourceTracker) private outsourceTrackerRepository: Repository<OutsourceTracker>,
          @InjectEntityManager() private readonly entityManager: EntityManager,
          @InjectRepository(CancelContract)
          private cancelContractRepository: Repository<CancelContract>,
          @InjectRepository(AfterValue)
          private afterValueRepository: Repository<AfterValue>,
          @InjectRepository(BeforeValue )
          private beforeValueRepository: Repository<BeforeValue>,
      ) { }

      async resetAutoIncrement(): Promise<void> {
          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE debtor SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE debtor AUTO_INCREMENT = 1`);

          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE secondor SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE secondor AUTO_INCREMENT = 1`);

          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE installment SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE installment AUTO_INCREMENT = 1`);

          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE phone_call_tracker SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE phone_call_tracker AUTO_INCREMENT = 1`);

          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE document_tracker SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE document_tracker AUTO_INCREMENT = 1`);

          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE outsource_tracker SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE outsource_tracker AUTO_INCREMENT = 1`);

          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE cancel_contract SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE cancel_contract AUTO_INCREMENT = 1`);

          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE after_value SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE after_value  AUTO_INCREMENT = 1`);

          await this.debtorRepository.query(`SET @num = 0`);
          await this.debtorRepository.query(`UPDATE before_value SET id = @num := (@num + 1)`);
          await this.debtorRepository.query(`ALTER TABLE before_value  AUTO_INCREMENT = 1`);
      }

      async findDebtors(): Promise<Debtor[]> {
          try {
              return await this.debtorRepository.find({
                  relations: [
                      'installment', 'secondor', 'phoneCallTrackers','documentTrackers','outsourceTrackers','cancelContract',
                      'afterValue','beforeValue'
                  ]
              });
          }
          catch (error) {
              throw error;
          }
      }

      async findOne(id: number): Promise<Debtor | null> {
          return await this.debtorRepository.findOne({
              where: {
                  id,
              },
              relations: ['installment', 'secondor', 'phoneCallTrackers','documentTrackers','outsourceTrackers','cancelContract'
              ,
              'afterValue','beforeValue'
              ]
          });
      }
      async deleteDebtor(id: number): Promise<void> {
          const debtor = await this.debtorRepository.findOne({
              where: {
                  id,
              },
              relations: ['installment', 'secondor', 'phoneCallTrackers','documentTrackers','outsourceTrackers','cancelContract']
          });
          if (!debtor) {
              throw new HttpException('Debtor not found', HttpStatus.NOT_FOUND);
          }

          await this.debtorRepository.delete(id);

      }

      //installlment
      async updateInstallment(id: number, updateInstallmentDto: CreateInstallmentDto): Promise<Installment> {
          await this.installmentRepository.update(id, updateInstallmentDto);
          return this.installmentRepository.findOneBy({ id });
      }

      async getOutstandingDebtorsByInstallment(installmentNumber: number): Promise<Debtor[]> {
          return this.debtorRepository.createQueryBuilder('debtor')
              .innerJoinAndSelect('debtor.installment', 'installment')
              .innerJoinAndSelect('debtor.secondor', 'secondor')
              .where('installment.installment_number = :installmentNumber', { installmentNumber })
              .getMany();
      }

      async countDebtorsWithInstallmentGreaterThanZero(): Promise<number> {
          const count = await this.debtorRepository.createQueryBuilder('debtor')
              .innerJoin('debtor.installment', 'installment')
              .where('installment.installment_number > :installmentNumber', { installmentNumber: 0 })
              .getCount();

          return count;
      }

      //PhoneTracker
      async getAllPhoneCallTrackers(debtorId: number): Promise<PhoneCallTracker[]> {
          try {
            return await this.phoneTrackerRepository.find({ where: { debtor: { id: debtorId } },
              relations: ['debtor'] });
          } catch (error) {
            throw new Error('Failed to retrieve phone call trackers');
          }
        }

      async getPhoneCallTracker(id: number): Promise<PhoneCallTracker | null> {
          try {
              return await this.phoneTrackerRepository.findOneBy({id});
          } catch (error) {
              throw new HttpException('Error retrieving phone call tracker', HttpStatus.INTERNAL_SERVER_ERROR);
          }
      }
      async createPhoneTracker(
          id: number,
          createPhoneTrackerDetail: CreatePhoneTrackerParams
      ) {
          const debtor = await this.debtorRepository.findOneBy({ id });
          if (!debtor) throw new HttpException('User not found. Cannot create Phone Tracker', HttpStatus.BAD_REQUEST);
          const newPhoneTracker = this.phoneTrackerRepository.create(
              {
                  ...createPhoneTrackerDetail,
                  debtor,
              }
          );
          return this.phoneTrackerRepository.save(newPhoneTracker);

      }
      async updatePhoneTracker(id: number, updatePhoneTrackerDto: UpdatePhoneTrackerDto): Promise<PhoneCallTracker> {
          const phoneTracker = await this.phoneTrackerRepository.findOneBy({id});
      
          if (!phoneTracker) {
            throw new NotFoundException('Phone tracker not found');
          }
          phoneTracker.username_tracker = updatePhoneTrackerDto.username_tracker;
          phoneTracker.response = updatePhoneTrackerDto.response;
          phoneTracker.comments = updatePhoneTrackerDto.comments;
      
          return this.phoneTrackerRepository.save(phoneTracker);
        }
      
        async deletePhoneTracker(id: number): Promise<void> {
          const phoneTracker = await this.phoneTrackerRepository.findOneBy({id});
      
          if (!phoneTracker) {
            throw new NotFoundException('Phone tracker not found');
          }
      
          await this.phoneTrackerRepository.remove(phoneTracker);
        }
      
        //count phone tracker
        async countPhoneCallsUniqueDebtorIds(): Promise<number> {
          const uniqueDebtorIds = await this.phoneTrackerRepository
            .createQueryBuilder("phoneTracker")
            .select("DISTINCT(phoneTracker.debtorId)", "debtorId")
            .getRawMany();
          return uniqueDebtorIds.length;
        } 

        async countPhoneCallsByDebtorId(debtorId: number): Promise<number> {
          try {
            const count = await this.phoneTrackerRepository.count({ where: { debtor: { id: debtorId } } });
            return count;
          } catch (error) {
            console.error('Error counting phone calls by debtor ID:', error);
            throw new HttpException('Error counting phone calls by debtor ID', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }

        //DocumentTracker
      async getAllDocumentTracker(debtorId: number): Promise<DocumentTracker[]> {
          try {
            return await this.documentTrackerRepository.find({ where: { debtor: { id: debtorId } },
              relations: ['debtor'] });
          } catch (error) {
            throw new Error('Failed to retrieve Document Tracker');
          }
        }
      async getDocumentTracker(id: number): Promise<DocumentTracker | null> {
          try {
              return await this.documentTrackerRepository.findOneBy({id});
          } catch (error) {
              throw new HttpException('Error retrieving Document Tracker', HttpStatus.INTERNAL_SERVER_ERROR);
          }
      }
      async createDocumentTracker(
          id: number,
          createDocumentTrackerDetail: CreateDocumentTrackerParams
      ) {
          const debtor = await this.debtorRepository.findOneBy({ id });
          if (!debtor) throw new HttpException('User not found. Cannot create Document Tracker', HttpStatus.BAD_REQUEST);
          const newDocumentTracker = this.documentTrackerRepository.create(
              {
                  ...createDocumentTrackerDetail,
                  debtor,
              }
          );
          return this.documentTrackerRepository.save(newDocumentTracker);

      }
      async updateDocumentTracker(id: number, updateDocumentTrackerDto: UpdateDocumentTrackerDto): Promise<DocumentTracker> {
          const documentTracker = await this.documentTrackerRepository.findOneBy({id});
      
          if (!documentTracker) {
            throw new NotFoundException('Document Tracker not found');
          }
          documentTracker.response = updateDocumentTrackerDto.response;
          documentTracker.comments = updateDocumentTrackerDto.comments;
      
          return this.documentTrackerRepository.save(documentTracker);
        }
      
        async deleteDocumentTracker(id: number): Promise<void> {
          const documentTracker = await this.documentTrackerRepository.findOneBy({id});
      
          if (!documentTracker) {
            throw new NotFoundException('Document Tracker not found');
          }
      
          await this.documentTrackerRepository.remove(documentTracker);
        }
      
        //count DocumentTracker
        async countDocumentTrackerUniqueDebtorIds(): Promise<number> {
          const uniqueDebtorIds = await this.documentTrackerRepository
            .createQueryBuilder("documentTracker")
            .select("DISTINCT(documentTracker.debtorId)", "debtorId")
            .getRawMany();
          return uniqueDebtorIds.length;
        } 

        async countDocumentTrackerByDebtorId(debtorId: number): Promise<number> {
          try {
            const count = await this.documentTrackerRepository.count({ where: { debtor: { id: debtorId } } });
            return count;
          } catch (error) {
            console.error('Error counting Document Tracker by debtor ID:', error);
            throw new HttpException('Error counting Document Tracker by debtor ID', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }

        //OutsourceTracker
      async getAllOutsourceTracker(debtorId: number): Promise<OutsourceTracker[]> {
        try {
          return await this.outsourceTrackerRepository.find({ where: { debtor: { id: debtorId } },
            relations: ['debtor'] });
        } catch (error) {
          throw new Error('Failed to retrieve OutsourceTracker');
        }
      }

    async getOutsourceTracker(id: number): Promise<OutsourceTracker | null> {
        try {
            return await this.outsourceTrackerRepository.findOneBy({id});
        } catch (error) {
            throw new HttpException('Error retrieving OutsourceTracker', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createOutsourceTracker(
        id: number,
        createOutsourceTrackerDetail: CreateOutsourceTrackerParams
    ) {
        const debtor = await this.debtorRepository.findOneBy({ id });
        if (!debtor) throw new HttpException('User not found. Cannot create OutsourceTracker', HttpStatus.BAD_REQUEST);
        const newOutsourceTracker = this.outsourceTrackerRepository.create(
            {
                ...createOutsourceTrackerDetail,
                debtor,
            }
        );
        return this.outsourceTrackerRepository.save(newOutsourceTracker);

    }
    async updateOutsourceTracker(id: number, updateOutsourceTrackerDto: UpdateOutsourceTrackerDto): Promise<OutsourceTracker> {
        const outsourceTracker = await this.outsourceTrackerRepository.findOneBy({id});
    
        if (!outsourceTracker) {
          throw new NotFoundException('Document Tracker not found');
        }
        outsourceTracker.response = updateOutsourceTrackerDto.response;
        outsourceTracker.comments = updateOutsourceTrackerDto.comments;
    
        return this.outsourceTrackerRepository.save(outsourceTracker);
      }
    
      async deleteOutsourceTracker(id: number): Promise<void> {
        const outsourceTracker = await this.outsourceTrackerRepository.findOneBy({id});
    
        if (!outsourceTracker) {
          throw new NotFoundException('Document Tracker not found');
        }
    
        await this.outsourceTrackerRepository.remove(outsourceTracker);
      }

      //count OutsourceTracker
      async countOutsourceTrackerUniqueDebtorIds(): Promise<number> {
        const uniqueDebtorIds = await this.outsourceTrackerRepository
          .createQueryBuilder("outsourceTracker")
          .select("DISTINCT(outsourceTracker.debtorId)", "debtorId")
          .getRawMany();
        return uniqueDebtorIds.length;
      } 

      async countOutsourceTrackerByDebtorId(debtorId: number): Promise<number> {
        try {
          const count = await this.outsourceTrackerRepository.count({ where: { debtor: { id: debtorId } }, });
          return count;
        } catch (error) {
          console.error('Error counting OutsourceTracker by debtor ID:', error);
          throw new HttpException('Error counting OutsourceTracker by debtor ID', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      //cancel contract
      async getAllCancelContract(debtorId: number): Promise<CancelContract[]> {
        try {
          return await this.cancelContractRepository.find({ where: { debtor: { id: debtorId } },
            relations: ['debtor'] });
        } catch (error) {
          throw new Error('Failed to retrieve CancelContract');
        }
      }

    async getCancelContract(id: number): Promise<CancelContract | null> {
        try {
            return await this.cancelContractRepository.findOneBy({id});
        } catch (error) {
            throw new HttpException('Error retrieving CancelContract', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCancelContract(
        id: number,
        createCancelContractDetail: CreateCancelContractParams
    ) {
        const debtor = await this.debtorRepository.findOneBy({ id });
        if (!debtor) throw new HttpException('User not found. Cannot create CancelContract', HttpStatus.BAD_REQUEST);
        const newCancelContract = this.cancelContractRepository.create(
            {
                ...createCancelContractDetail,
                debtor,
            }
        );
        return this.cancelContractRepository.save(newCancelContract);

    }
    async updateCancelContract(id: number, updateCancelContractDto: UpdateCancelContractDto): Promise<CancelContract> {
        const cancelContract = await this.cancelContractRepository.findOneBy({id});
    
        if (!cancelContract) {
          throw new NotFoundException('Document Tracker not found');
        }
        cancelContract.type_item = updateCancelContractDto.type_item;
        cancelContract.response = updateCancelContractDto.response;
        cancelContract.comments = updateCancelContractDto.comments;
    
        return this.cancelContractRepository.save(cancelContract);
      }
    
      async deleteCancelContract(id: number): Promise<void> {
        const cancelContract = await this.cancelContractRepository.findOneBy({id});
    
        if (!cancelContract) {
          throw new NotFoundException('Document Tracker not found');
        }
    
        await this.cancelContractRepository.remove(cancelContract);
      }

      //count CancelContract
      async countCancelContractUniqueDebtorIds(): Promise<number> {
        const uniqueDebtorIds = await this.cancelContractRepository
          .createQueryBuilder("cancelContract")
          .select("DISTINCT(cancelContract.debtorId)", "debtorId")
          .getRawMany();
        return uniqueDebtorIds.length;
      } 

      async countCancelContractByDebtorId(debtorId: number): Promise<number> {
        try {
          const count = await this.cancelContractRepository.count({ where: { debtor: { id: debtorId } } });
          return count;
        } catch (error) {
          console.error('Error counting CancelContract by debtor ID:', error);
          throw new HttpException('Error counting CancelContract by debtor ID', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }


    //Aftervalue
    async getAllAftervalue(debtorId: number): Promise<AfterValue[]> {
      try {
        return await this.afterValueRepository.find({ where: { debtor: { id: debtorId } },
          relations: ['debtor'] });
      } catch (error) {
        throw new Error('Failed to retrieve Aftervalue');
      }
    }

  async createAftervalue(
      id: number,
      createAftervalueDetail: CreateAfterValueParams
  ) {
      const debtor = await this.debtorRepository.findOneBy({ id });
      if (!debtor) throw new HttpException('User not found. Cannot create Aftervalue', HttpStatus.BAD_REQUEST);
      const newAftervalue = this.afterValueRepository.create(
          {
              ...createAftervalueDetail,
              debtor,
          }
      );
      return this.afterValueRepository.save(newAftervalue);

  }
  async updateAftervalue(id: number, updateAftervalueDto: UpdateAfterValueDto): Promise<AfterValue> {
      const aftervalue = await this.afterValueRepository.findOneBy({id});
  
      if (!aftervalue) {
        throw new NotFoundException('Document Tracker not found');
      }
      aftervalue.name_value = updateAftervalueDto.name_value;
      aftervalue.price_value = updateAftervalueDto.price_value;
  
      return this.afterValueRepository.save(aftervalue);
    }
  
    async deleteAftervalue(id: number): Promise<void> {
      const aftervalue = await this.afterValueRepository.findOneBy({id});
  
      if (!aftervalue) {
        throw new NotFoundException('Document Tracker not found');
      }
  
      await this.afterValueRepository.remove(aftervalue);
    }
     //Beforevalue
     async getAllBeforevalue(debtorId: number): Promise<BeforeValue[]> {
      try {
        return await this.beforeValueRepository.find({ where: { debtor: { id: debtorId } },
          relations: ['debtor'] });
      } catch (error) {
        throw new Error('Failed to retrieve Beforevalue');
      }
    }

  async createBeforevalue(
      id: number,
      createBeforevalueDetail: CreateBeforeValueParams
  ) {
      const debtor = await this.debtorRepository.findOneBy({ id });
      if (!debtor) throw new HttpException('User not found. Cannot create Beforevalue', HttpStatus.BAD_REQUEST);
      const newBeforevalue = this.beforeValueRepository.create(
          {
              ...createBeforevalueDetail,
              debtor,
          }
      );
      return this.beforeValueRepository.save(newBeforevalue);

  }
  async updateBeforevalue(id: number, updateBeforevalueDto: UpdateBeforeValueDto): Promise<BeforeValue> {
      const beforevalue = await this.beforeValueRepository.findOneBy({id});
  
      if (!beforevalue) {
        throw new NotFoundException('Document Tracker not found');
      }
      beforevalue.name_value = updateBeforevalueDto.name_value;
      beforevalue.price_value = updateBeforevalueDto.price_value;
  
      return this.beforeValueRepository.save(beforevalue);
    }
  
    async deleteBeforevalue(id: number): Promise<void> {
      const beforevalue = await this.beforeValueRepository.findOneBy({id});
  
      if (!beforevalue) {
        throw new NotFoundException('Document Tracker not found');
      }
  
      await this.beforeValueRepository.remove(beforevalue);
    }
  }
