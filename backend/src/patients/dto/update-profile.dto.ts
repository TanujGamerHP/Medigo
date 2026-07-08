import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Jane', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '1990-05-15', description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty({ example: 'Female', description: 'Gender identity' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 1.68, description: 'Height in meters' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ example: 68.5, description: 'Weight in kilograms' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ example: 'O+', description: 'Blood group category' })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({
    example: '+15550199',
    description: 'Emergency contact number',
  })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile image public URL',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
