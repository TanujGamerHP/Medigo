import { IsString, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ example: 'doctor@medigo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  specialization: string;

  @ApiProperty({ example: '10 years' })
  @IsString()
  experience: string;

  @ApiPropertyOptional({ example: 'MBBS, MD' })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiPropertyOptional({ example: 'LIC12345' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: 'City Hospital' })
  @IsOptional()
  @IsString()
  hospital?: string;

  @ApiPropertyOptional({ example: 'Experienced cardiologist...' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'HDFC Bank' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: '000000000000' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ example: 'HDFC0001234' })
  @IsOptional()
  @IsString()
  ifscCode?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;
}
