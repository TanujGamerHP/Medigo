import { IsEnum, IsString, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ enum: UserRole, description: 'Role update' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: 'Active', description: 'Status update (Active, Deactivated)' })
  @IsOptional()
  @IsString()
  status?: string;
}
