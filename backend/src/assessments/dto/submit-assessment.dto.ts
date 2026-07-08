import {
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAssessmentDto {
  @ApiProperty({ example: 32, description: 'Age of the patient' })
  @IsNumber()
  @Min(18)
  @Max(120)
  age: number;

  @ApiProperty({ example: 'Female', description: 'Gender' })
  @IsString()
  gender: string;

  @ApiProperty({ example: 1.65, description: 'Height in meters' })
  @IsNumber()
  @Min(0.5)
  @Max(2.5)
  height: number;

  @ApiProperty({ example: 75.0, description: 'Weight in kilograms' })
  @IsNumber()
  @Min(20)
  @Max(300)
  weight: number;

  @ApiProperty({
    example: ['Hypertension'],
    description: 'List of past medical conditions',
  })
  @IsArray()
  @IsString({ each: true })
  healthHistory: string[];

  @ApiProperty({ example: 'None', description: 'Current medications' })
  @IsString()
  currentMedications: string;

  @ApiProperty({ example: 62.0, description: 'Target weight in kilograms' })
  @IsNumber()
  @Min(20)
  @Max(300)
  targetWeight: number;

  @ApiProperty({ example: 'Moderate', description: 'Activity level' })
  @IsString()
  activityLevel: string;

  @ApiProperty({ example: 'Balanced', description: 'Diet type' })
  @IsString()
  dietType: string;

  @ApiProperty({ example: 7, description: 'Sleep hours per night' })
  @IsNumber()
  @Min(0)
  @Max(24)
  sleepHours: number;
}
