import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Get(':id/points')
  findOne(@Param('id') id: string): { id: number; points: number } {
    return this.receiptService.findOne(id);
  }

  @Post('process')
  createReceipt(@Body() receipt: CreateReceiptDto): { id: number } {
    return this.receiptService.create(receipt);
  }
}
