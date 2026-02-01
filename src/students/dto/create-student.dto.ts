import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsOptional } from "class-validator";

export class CreateStudentDto {

    @ApiProperty({
        description: 'Lugar de recogida para lecciones tras volante',
        example: 'N560- Full Avenue'
    })
    @IsString()
    btw_pickup_location: string;

    @ApiProperty({
        description: 'Nombre del estudiante',
        example: 'Mateo'
    })
    @IsString()
    student_first_name: string;

    @ApiProperty({
        description: 'Segundo nombre del estudiante',
        example: 'Andres'
    })
    @IsString()
    @IsOptional()
    student_middle_name: string;

    @ApiProperty({
        description: 'Apellido del estudiante',
        example: 'Torres'
    })
    @IsString()
    student_last_name: string;

    @ApiProperty({
        description: 'Dirección del estudiante',
        example: 'N560 - Full Ave.'
    })
    @IsString()
    student_address: string;

    @ApiProperty({
        description: 'Ciudad de residencia del estudiante',
        example: 'Quito'
    })
    @IsString()
    student_city: string;

    @ApiProperty({
        description: 'Estado de residencia del estudiante',
        example: 'Pichincha'
    })
    @IsString()
    student_state: string;

    @ApiProperty({
        description: 'Código postal del estudiante',
        example: '170150'
    })
    @IsString()
    student_zip_code: string;

    @ApiProperty({
        description: 'Email del estudiante',
        example: 'mateo@correo.com'
    })
    @IsString()
    student_email: string;

    @ApiProperty({
        description: 'Número del estudiante',
        example: '0998335939'
    })
    @IsString()
    student_phone_number: string;

    @ApiProperty({
        description: 'Número alternativo del estudiante',
        example: '0963369191'
    })
    @IsString()
    @IsOptional()
    student_other_phone_number: string;

    @ApiProperty({
        description: 'Sexo del estudiante',
        example: 'M'
    })
    @IsString()
    student_sex: string;

    @ApiProperty({
        description: 'Fecha de nacimiento del estudiante',
        example: '2005-07-08'
    })
    @IsString()
    student_birth_date: string;


    @ApiProperty({
        description: 'Número de Licencia o Permiso de Aprendizaje (DL/Permit #)',
        example: 'A12345678'
    })
    @IsString()
    @IsOptional()
    student_permit_number: string;

    @ApiProperty({
        description: 'Condiciones médicas del estudiante',
        example: 'Usa lentes de contacto'
    })
    @IsString()
    @IsOptional()
    student_medical_conditions: string;

    @ApiProperty({
        description: 'Fecha de emisión del permiso (DL/Permit Issued)',
        example: '2023-01-15'
    })
    @IsString()
    @IsOptional()
    student_permit_issued: string;

    @ApiProperty({
        description: 'Fecha de expiración del permiso (DL/Permit Expiration)',
        example: '2025-01-15'
    })
    @IsString()
    @IsOptional()
    student_permit_expiration: string;


    @ApiProperty({
        description: 'Colegio del estudiante',
        example: 'Colegio Americano'
    })
    @IsString()
    student_high_school: string;

    @ApiProperty({
        description: 'Nombre del padre del estudiante',
        example: 'Juan Torres'
    })
    @IsString()
    student_parent_name: string;

    @ApiProperty({
        description: 'Teléfono del padre del estudiante',
        example: '0998335788'
    })
    @IsString()
    student_parent_phone: string;

    @ApiProperty({
        description: 'Correo electrónico del padre',
        example: 'padre@correo.com'
    })
    @IsString()
    @IsOptional()
    student_parent_email: string;

    @ApiProperty({
        description: 'Referencia (Cómo se enteró de nosotros)',
        example: 'Google ads'
    })
    @IsString()
    student_lead_source: string;

    @ApiProperty({
        description: 'Notas de conducción / Observaciones adicionales',
        example: 'El estudiante tiene miedo a las autopistas.'
    })
    @IsString()
    @IsOptional()
    student_driving_notes: string;

    @ApiProperty({
        description: 'Talla de camiseta del estudiante',
        example: 'M'
    })
    @IsString()
    student_tshirt_size: string;

    @ApiProperty({
        description: 'Persona que creo el estudiante',
        example: 'Mateo Torres'
    })
    @IsString()
    created_by: string;
}