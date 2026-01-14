// src/users/dto/users-filter.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsOptional } from 'class-validator';
import { Role, StaffType } from '../entities/user.entity';

export class UsersFilterDto {
    @ApiPropertyOptional({
        description: 'Filtrar por estado activo (true) o inactivo (false). Si se omite, devuelve todos.',
        example: 'true',
    })
    @IsOptional()
    @IsBooleanString({ message: 'isActive debe ser "true" o "false"' })
    isActive?: string;

    @ApiPropertyOptional({
        description: 'Filtrar por rol del usuario (admin, employee, customer)',
        enum: Role,
        example: Role.EMPLOYEE,
    })
    @IsOptional()
    @IsEnum(Role, { message: 'role debe ser uno de: admin, employee o customer' })
    role?: Role;

    @ApiPropertyOptional({
        description: 'Filtrar por tipo de staff (full_time, part_time, contractor, intern, other)',
        enum: StaffType,
        example: StaffType.FULL_TIME,
    })
    @IsOptional()
    @IsEnum(StaffType, { message: 'typeOfStaff debe ser un valor válido' })
    typeOfStaff?: StaffType
}
