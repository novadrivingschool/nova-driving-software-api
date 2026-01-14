import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsBoolean, IsEnum, IsString, IsDateString, IsUrl, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, StaffType } from '../entities/user.entity';

export class CreateUserProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() birthdate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gender?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() avatarUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsString() employee_number?: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  @ApiProperty({ minLength: 8, example: 'StrongPass123' })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message: 'Password must include upper, lower and number' })
  password?: string;

  @ApiPropertyOptional({ enum: Role, isArray: true, example: ['admin'] })
  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: CreateUserProfileDto })
  @IsOptional()
  profile?: CreateUserProfileDto;

  /** 🔹 Nuevo campo: tipo de staff */
  @ApiPropertyOptional({
    enum: StaffType,
    example: StaffType.FULL_TIME,
    description: 'Tipo de personal (full_time, part_time, contractor, intern, other)',
  })
  @IsOptional()
  @IsEnum(StaffType)
  typeOfStaff?: StaffType
}
