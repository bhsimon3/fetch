import { IsNumber } from 'class-validator';

export class PointsDto {
  @IsNumber()
  points: number;
}
