import { IsNumber, IsString, ValidateNested, IsArray } from 'class-validator';
import { ItemDto } from './item.dto';

export class CreateReceiptDto {
  @IsString()
  retailer: string;

  @IsString()
  purchaseDate: string;

  @IsString()
  purchaseTime: string;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested()
  items: ItemDto[];
}
