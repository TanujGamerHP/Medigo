import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({
    example: 'How long does shipment of Wegovy take?',
    description: 'FAQ Question',
  })
  @IsString()
  question: string;

  @ApiProperty({
    example:
      'Usually within 3 to 5 business days after clinician prescription approval.',
    description: 'FAQ Answer',
  })
  @IsString()
  answer: string;

  @ApiProperty({ example: 'Shipping', description: 'FAQ Category' })
  @IsString()
  category: string;
}
