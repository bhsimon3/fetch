import {
  IsString,
  ValidateNested,
  IsArray,
  IsNumberString,
} from 'class-validator';
import { ItemDto } from './item.dto';

export class CreateReceiptDto {
  @IsString()
  retailer: string;

  @IsString()
  purchaseDate: string;

  @IsString()
  purchaseTime: string;

  @IsNumberString()
  total: number;

  @IsArray()
  @ValidateNested()
  items: ItemDto[];
}
