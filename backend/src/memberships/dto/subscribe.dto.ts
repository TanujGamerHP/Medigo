import { IsString, IsNumber, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty({ example: 'Premium', description: 'Plan tier name' })
  @IsString()
  @IsIn(['Starter', 'Premium', 'Elite'])
  planName: string;

  @ApiProperty({ example: 299.0, description: 'Price paid' })
  @IsNumber()
  @Min(0)
  price: number;
}
