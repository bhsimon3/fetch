import { IsNumberString, IsString } from 'class-validator';

export class ItemDto {
  @IsString()
  shortDescription: string;

  @IsNumberString()
  price: number;
}
