import { IsNumber, IsString } from 'class-validator';

export class ItemDto {
  @IsString()
  shortDescription: string;

  @IsNumber()
  price: number;
}
