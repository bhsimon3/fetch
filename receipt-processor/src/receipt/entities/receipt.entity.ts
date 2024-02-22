import { ItemDto } from '../dto/item.dto';

export class Receipt {
  id: number;
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: ItemDto[];
  total: number;
  points: number;
}
