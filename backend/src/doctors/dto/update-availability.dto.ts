import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvailabilityDto {
  @ApiProperty({
    example: 'Available',
    description: 'Status (Available, Busy, OutOfOffice)',
  })
  @IsString()
  @IsIn(['Available', 'Busy', 'OutOfOffice'])
  status: string;
}
