import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator'; 

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo estudiante',
    description: 'Registra un nuevo alumno con toda su información personal, de contacto y de licencia.'
  })
  @ApiResponse({ status: 201, description: 'Estudiante creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (Bad Request).' })
  @ApiResponse({ status: 409, description: 'El estudiante ya existe (Conflicto de duplicados).' })
  @ApiBody({ type: CreateStudentDto })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todos los estudiantes',
    description: 'Obtiene el listado completo de estudiantes registrados en el sistema.'
  })
  @ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener un estudiante por UUID' })
  @ApiParam({ name: 'uuid', description: 'Identificador único (UUID) del estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante encontrado.' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado.' })
  findOne(@Param('uuid') uuid: string) {
    return this.studentsService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({
    summary: 'Actualizar información del estudiante',
    description: 'Actualiza los datos de un estudiante existente.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID del estudiante a actualizar' })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({ status: 200, description: 'Estudiante actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'No se enviaron datos para actualizar.' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado.' })
  @ApiResponse({ status: 409, description: 'Conflicto de datos (ej. email duplicado).' })
  update(@Param('uuid') uuid: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(uuid, updateStudentDto);
  }

  @Public()
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Eliminar estudiante',
    description: 'Elimina permanentemente el registro de un estudiante de la base de datos.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID del estudiante a eliminar' })
  @ApiResponse({ status: 200, description: 'Estudiante eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado.' })
  remove(@Param('uuid') uuid: string) {
    return this.studentsService.remove(uuid);
  }
}