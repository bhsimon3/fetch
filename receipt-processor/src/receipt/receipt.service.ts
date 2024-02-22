import { Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { Receipt } from './entities/receipt.entity';
import { ItemDto } from './dto/item.dto';
import { DateIs } from './enums/DateIs.enum';

@Injectable()
export class ReceiptService {
  private readonly receipts: Map<number, Omit<Receipt, 'id'>> = new Map();

  create(dto: CreateReceiptDto) {
    const receipt = { ...dto, points: this.calculatePoints(dto) };
    const id = this.receipts.size;
    this.receipts.set(id, receipt);
    return { id };
  }

  findOne(inputId: string): { id: number; points: number } {
    const id = Number(inputId);
    if (this.receipts.has(id)) {
      const receipt = this.receipts.get(id);
      return { id, points: receipt.points };
    }
  }

  private calculatePoints(dto: CreateReceiptDto) {
    let points = 0;

    points += this.calcAlphanumericRetailerPoints(dto.retailer, 1);
    points += this.calcTotalIsMultiplePoints(dto.total, 1, 50);
    points += this.calcTotalIsMultiplePoints(dto.total, 0.25, 25);
    points += this.calcNumItemsPoints(dto.items, 2, 5);
    points += this.calcTrimmedDescriptionLengthPoints(dto.items, 3, 0.2);
    points += this.calcPurchaseDatePoints(dto.purchaseDate, DateIs.ODD, 6);
    points += this.calcPurchaseTimePoints(
      dto.purchaseTime,
      '14:00',
      '16:00',
      10,
    );

    return points;
  }

  private calcAlphanumericRetailerPoints(
    retailer: string,
    pointsPerCharacter: number,
  ): number {
    let counter = 0;
    for (let i = 0; i < retailer.length; i++) {
      if (/[a-zA-Z0-9]/.test(retailer[i])) {
        counter++;
      }
    }
    return counter * pointsPerCharacter;
  }

  private calcTotalIsMultiplePoints(
    total: number,
    multipleOf: number,
    pointsAwarded: number,
  ): number {
    return total % multipleOf === 0 ? pointsAwarded : 0;
  }

  private calcNumItemsPoints(
    items: ItemDto[],
    numItems: number,
    pointsAwarded: number,
  ): number {
    return Math.floor(items.length / numItems) * pointsAwarded;
  }

  private calcTrimmedDescriptionLengthPoints(
    items: ItemDto[],
    multipleOf: number,
    ratio: number,
  ): number {
    let points = 0;
    for (const item of items) {
      if (item.shortDescription.trim().length % multipleOf === 0) {
        points += item.price * ratio;
      }
    }

    return points;
  }

  private calcPurchaseDatePoints(
    purchaseDate: string,
    dateIs: DateIs,
    pointsAwarded: number,
  ): number {
    const purchaseDay = Number(purchaseDate.split('-')[2]);
    if (dateIs === DateIs.ODD) {
      return purchaseDay % 2 !== 0 ? pointsAwarded : 0;
    } else {
      return purchaseDay % 2 === 0 ? pointsAwarded : 0;
    }
  }

  private calcPurchaseTimePoints(
    purchaseTimeString: string,
    startTimeString: string,
    endTimeString: string,
    pointsAwarded: number,
  ): number {
    const convertTimeString = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes;
    };

    const purchaseTime = convertTimeString(purchaseTimeString);
    const startTime = convertTimeString(startTimeString);
    const endTime = convertTimeString(endTimeString);

    if (purchaseTime > startTime && purchaseTime < endTime) {
      return pointsAwarded;
    }

    return 0;
  }
}
