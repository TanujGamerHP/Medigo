import { IsString, IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrescriptionDto {
  @ApiProperty({ example: 'patient-uuid', description: 'Patient record ID' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ example: 'appointment-uuid', description: 'Associated appointment ID' })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @ApiProperty({ example: 'Obesity Class II', description: 'Diagnosis text' })
  @IsString()
  diagnosis: string;

  @ApiProperty({ example: 'Semaglutide 0.5mg', description: 'Prescribed medication name and dosage' })
  @IsString()
  medications: string;

  @ApiProperty({ example: 'Inject 0.5mg subcutaneously once weekly.', description: 'Patient intake instructions' })
  @IsString()
  instructions: string;

  @ApiProperty({ example: '2026-08-15', description: 'Follow up check-in date' })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}
