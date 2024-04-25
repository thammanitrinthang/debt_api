import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { DebtorService } from 'src/debt/service/debtor/debtor.service';
import { CreateDocumentTrackerDto, UpdateDocumentTrackerDto } from 'src/dtos/Document_tracker.dto';
import { CreateInstallmentDto } from 'src/dtos/Installment.dto';
import { CreateOutsourceTrackerDto, UpdateOutsourceTrackerDto } from 'src/dtos/Outsource_tracker.dto';
import { CreatePhoneTrackerDto, UpdatePhoneTrackerDto } from 'src/dtos/Phone_tracker.dto';
import { Debtor } from 'src/entities/debtors';
import { DocumentTracker } from 'src/entities/document_tracker';
import { Installment } from 'src/entities/installment';
import { OutsourceTracker } from 'src/entities/outsource_tracker';
import { PhoneCallTracker } from 'src/entities/phone_tracker';

@Controller('debtor')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) { }

  @Get()
  async getDebtor() {
    return this.debtorService.findDebtors();
  }
  @Post('reset')
  async resetAutoIncrement(): Promise<any> {
    try {
      await this.debtorService.resetAutoIncrement();
      return {
        message: 'Auto-increment reset successfully',
      };
    } catch (error) {
      console.error('Error resetting auto-increment:', error);
      throw new HttpException('Failed to reset auto-increment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Debtor> {
    return this.debtorService.findOne(+id);
  }
  
  @Delete(':id')
  async deleteDebtor(@Param('id') id: string): Promise<string> {
    try {
      await this.debtorService.deleteDebtor(+id);
      await this.debtorService.resetAutoIncrement();
      return 'Debtor deleted successfully';
    } catch (error) {
      throw new HttpException('Failed to delete debtor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id/installment')
  async updateInstallment(@Param('id') id: number, @Body() updateInstallmentDto: CreateInstallmentDto): Promise<Installment> {
    return this.debtorService.updateInstallment(id, updateInstallmentDto);
  }

  @Get('/debt_installment/:installmentNumber')
  async getDebtorsByInstallment(@Param('installmentNumber') installmentNumber: number): Promise<Debtor[]> {
    return this.debtorService.getOutstandingDebtorsByInstallment(installmentNumber);
  }
  @Get('debt_installment/:installmentNumber/count')
  async countDebtorsWithInstallment(): Promise<number> {
    return this.debtorService.countDebtorsWithInstallmentGreaterThanZero();
  }

  //PhoneTracker
  @Get(':id/phone_tracker')
  async getAllPhoneCallTrackers(@Param('id') id: number): Promise<PhoneCallTracker[]> {
    try {
      const allPhoneCallTrackers = await this.debtorService.getAllPhoneCallTrackers(id);
      if (!allPhoneCallTrackers) {
        throw new HttpException('Phone call trackers not found', HttpStatus.NOT_FOUND);
      }
      return allPhoneCallTrackers;
    } catch (error) {
      throw new HttpException('Error retrieving phone call trackers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(':id/phone_tracker/:trackerId')
  async getPhoneCallTracker(@Param('id') id: number, @Param('trackerId') trackerId: number): Promise<PhoneCallTracker> {
    try {
      const phoneCallTracker = await this.debtorService.getPhoneCallTracker(trackerId);
      if (!phoneCallTracker) {
        throw new HttpException('Phone call tracker not found', HttpStatus.NOT_FOUND);
      }
      return phoneCallTracker;
    } catch (error) {
      throw new HttpException('Error retrieving phone call tracker', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post(':id/phone_tracker')
  createPhoneTracker(
  @Param('id', ParseIntPipe) id: number,
  @Body() createPhoneTrackerDto: CreatePhoneTrackerDto)
  {
  return this.debtorService.createPhoneTracker(id,createPhoneTrackerDto);
  }
  @Put('phone_tracker/:id')
  updatePhoneTracker(
    @Param('id') id: number,
    @Body() updatePhoneTrackerDto: UpdatePhoneTrackerDto
  ) {
    return this.debtorService.updatePhoneTracker(id, updatePhoneTrackerDto);
  }
  @Delete('phone_tracker/:id')
  async deletePhoneTracker(@Param('id') id: string): Promise<string> {
    try {
      await this.debtorService.deletePhoneTracker(+id);
      await this.debtorService.resetAutoIncrement();
      return 'Phone Tracker deleted successfully';
    } catch (error) {
      throw new HttpException('Failed to delete debtor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //PhoneTracker count
  @Get(':id/phone_calls/count')
  async countPhoneCallsByDebtorId(@Param('id') id: string): Promise<number> {
    try {
      const debtorId = parseInt(id);
      return await this.debtorService.countPhoneCallsByDebtorId(debtorId);
    } catch (error) {
      throw new HttpException('Failed to count phone calls for debtor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('phone_calls/count')
  async countPhoneCallsUniqueDebtorIds(): Promise<number> {
    return this.debtorService.countPhoneCallsUniqueDebtorIds();
  }

  //DocumentTracker
  @Get(':id/document_tracker')
  async getAllDocumentTracker(@Param('id') id: number): Promise<DocumentTracker[]> {
    try {
      const allDocumentTracker = await this.debtorService.getAllDocumentTracker(id);
      if (!allDocumentTracker) {
        throw new HttpException('DocumentTracker trackers not found', HttpStatus.NOT_FOUND);
      }
      return allDocumentTracker;
    } catch (error) {
      throw new HttpException('Error retrieving DocumentTracker trackers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(':id/document_tracker/:trackerId')
  async getDocumentTracker(@Param('id') id: number, @Param('trackerId') trackerId: number): Promise<DocumentTracker> {
    try {
      const documentTracker = await this.debtorService.getDocumentTracker(trackerId);
      if (!documentTracker) {
        throw new HttpException('DocumentTracker tracker not found', HttpStatus.NOT_FOUND);
      }
      return documentTracker;
    } catch (error) {
      throw new HttpException('Error retrieving DocumentTracker tracker', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post(':id/document_tracker')
  createDocumentTracker(
  @Param('id', ParseIntPipe) id: number,
  @Body() createDocumentTrackerDto: CreateDocumentTrackerDto)
  {
  return this.debtorService.createDocumentTracker(id,createDocumentTrackerDto);
  }
  @Put('document_tracker/:id')
  updateDocumentTracker(
    @Param('id') id: number,
    @Body() updateDocumentTrackerDto: UpdateDocumentTrackerDto
  ) {
    return this.debtorService.updateDocumentTracker(id, updateDocumentTrackerDto);
  }
  @Delete('document_tracker/:id')
  async deleteDocumentTracker(@Param('id') id: string): Promise<string> {
    try {
      await this.debtorService.deleteDocumentTracker(+id);
      await this.debtorService.resetAutoIncrement();
      return 'DocumentTracker deleted successfully';
    } catch (error) {
      throw new HttpException('Failed to delete debtor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //DocumentTracker count
  @Get(':id/document_trackers/count')
  async countDocumentTrackerByDebtorId(@Param('id') id: string): Promise<number> {
    try {
      const debtorId = parseInt(id);
      return await this.debtorService.countDocumentTrackerByDebtorId(debtorId);
    } catch (error) {
      throw new HttpException('Failed to count DocumentTracker for debtor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('document_trackers/count')
  async countDocumentTrackerUniqueDebtorIds(): Promise<number> {
    return this.debtorService.countDocumentTrackerUniqueDebtorIds();
  }

  //OutsourceTracker
  @Get(':id/outsource_tracker')
  async getAllOutsourceTracker(@Param('id') id: number): Promise<OutsourceTracker[]> {
    try {
      const allOutsourceTracker = await this.debtorService.getAllOutsourceTracker(id);
      if (!allOutsourceTracker) {
        throw new HttpException('OutsourceTracker not found', HttpStatus.NOT_FOUND);
      }
      return allOutsourceTracker;
    } catch (error) {
      throw new HttpException('Error retrieving OutsourceTracker trackers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(':id/outsource_tracker/:trackerId')
  async getOutsourceTracker(@Param('id') id: number, @Param('trackerId') trackerId: number): Promise<OutsourceTracker> {
    try {
      const outsourceTracker = await this.debtorService.getOutsourceTracker(trackerId);
      if (!outsourceTracker) {
        throw new HttpException('OutsourceTracker tracker not found', HttpStatus.NOT_FOUND);
      }
      return outsourceTracker;
    } catch (error) {
      throw new HttpException('Error retrieving OutsourceTracker tracker', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post(':id/outsource_tracker')
  createOutsourceTracker(
  @Param('id', ParseIntPipe) id: number,
  @Body() createOutsourceTrackerDto: CreateOutsourceTrackerDto)
  {
  return this.debtorService.createOutsourceTracker(id,createOutsourceTrackerDto);
  }
  
  @Put('outsource_tracker/:id')
  updateOutsourceTracker(
    @Param('id') id: number,
    @Body() updateOutsourceTrackerDto: UpdateOutsourceTrackerDto
  ) {
    return this.debtorService.updateOutsourceTracker(id, updateOutsourceTrackerDto);
  }
  @Delete('outsource_tracker/:id')
  async deleteOutsourceTracker(@Param('id') id: string): Promise<string> {
    try {
      await this.debtorService.deleteOutsourceTracker(+id);
      await this.debtorService.resetAutoIncrement();
      return 'OutsourceTracker deleted successfully';
    } catch (error) {
      throw new HttpException('Failed to delete Outsource', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //OutsourceTracker count
  @Get(':id/outsource_trackers/count')
  async countOutsourceTrackerByDebtorId(@Param('id') id: string): Promise<number> {
    try {
      const debtorId = parseInt(id);
      return await this.debtorService.countOutsourceTrackerByDebtorId(debtorId);
    } catch (error) {
      throw new HttpException('Failed to count OutsourceTracker for debtor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('outsource_trackers/count')
  async countOutsourceTrackerUniqueDebtorIds(): Promise<number> {
    return this.debtorService.countOutsourceTrackerUniqueDebtorIds();
  }
}