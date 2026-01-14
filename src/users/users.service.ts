import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Role } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfile } from './entities/user-profile.entity';
import * as moment from 'moment-timezone';
import { UsersFilterDto } from './dto/users-filter.dto';

const SALT_ROUNDS = 12;

function normalizeEmail(email: string) {
  return String(email).trim().toLowerCase();
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(UserProfile) private readonly profileRepo: Repository<UserProfile>,
    private readonly dataSource: DataSource,

  ) { }

  // Crea usuario: normaliza email y previene duplicados

  async create(dto: CreateUserDto): Promise<User> {
    console.log("CREATE.... ", dto);
    const email = normalizeEmail(dto.email);

    // 1) Unicidad de email
    const exists = await this.repo.findOne({ where: { email } });
    if (exists) throw new BadRequestException('Email already registered');

    // 2) Hash de password
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // 3) Normaliza roles (default CUSTOMER)
    const roles: Role[] = (dto.roles?.length ? dto.roles : [Role.CUSTOMER]) as Role[];

    // 4) Transacción: crea User y (si viene) su Profile
    return await this.dataSource.transaction(async (manager) => {
      // ✅ Crear usuario base con la nueva propiedad typeOfStaff
      const user = manager.create(User, {
        email,
        passwordHash,
        roles,
        isActive: dto.isActive ?? true,
        typeOfStaff: dto.typeOfStaff ?? null, // 👈 nuevo campo agregado
      });

      await manager.save(user);

      // ✅ Crear perfil opcional
      if (dto.profile) {
        const employee_number = this.generateEmployeeNumber(dto.profile.firstName);

        const profile = manager.create(UserProfile, {
          ...dto.profile,        // { firstName, lastName, ... }
          employee_number,       // <-- aquí asignamos
          user,                  // FK
        });
        await manager.save(profile);
      }

      // ✅ Devolver usuario con perfil cargado
      const withProfile = await manager.findOne(User, {
        where: { id: user.id },
        relations: { profile: true },
      });

      return withProfile ?? user;
    });
  }


  generateEmployeeNumber(firstName?: string): string {
    const prefix = 'VOUT';
    const name3 = (firstName ?? 'USR')
      .normalize('NFD')                      // quita acentos
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase()
      .slice(0, 3)
      .padEnd(3, 'X');

    const now = moment().tz('America/Chicago');
    const hh = now.format('HH');
    const mm = now.format('mm');
    const ss = now.format('ss');

    return `${prefix}${name3}${hh}${mm}${ss}`; // ej: VOUTJAV192222
  }

  // Lista todos (si luego quieres filtros/paginación, los añadimos)
  /* findAll(): Promise<User[]> {
    return this.repo.find();
  } */
  findAll(): Promise<User[]> {
    return this.repo.find({
      relations: { profile: true },   // 👈 carga el perfil
      order: { createdAt: 'DESC' },
    })
  }

  // Busca por id (deja null si no existe; el controller decide si 404)
  /* findOne(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  } */
  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: { profile: true },   // 👈 clave: carga el perfil
    })
  }

  // Actualiza con validaciones:
  // - Debe venir al menos un campo modificable
  // - Email normalizado y no duplicado (aunque cambie solo el case)
  // - Password re-hasheada si llega
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    // 1) Cargar con la relación
    const user = await this.repo.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');

    // 2) Checar si hay campos de User o de Profile
    const hasUserFields =
      typeof dto.email !== 'undefined' ||
      typeof dto.password !== 'undefined' ||
      typeof dto.roles !== 'undefined' ||
      typeof dto.isActive !== 'undefined' ||
      typeof dto.typeOfStaff !== 'undefined';   // 👈 nuevo

    const hasProfileFields =
      dto.profile &&
      typeof dto.profile === 'object' &&
      Object.keys(dto.profile).length > 0;

    if (!hasUserFields && !hasProfileFields) {
      throw new BadRequestException('No fields to update');
    }

    // 3) Email
    if (typeof dto.email !== 'undefined') {
      const newEmail = normalizeEmail(dto.email);
      if (newEmail !== user.email) {
        const taken = await this.repo.findOne({ where: { email: newEmail } });
        if (taken) throw new BadRequestException('Email already registered');
        user.email = newEmail;
      }
    }

    // 4) Password
    if (typeof dto.password !== 'undefined') {
      if (!dto.password || dto.password.length < 8) {
        throw new BadRequestException('Password must be at least 8 characters');
      }
      user.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    // 5) Roles
    if (typeof dto.roles !== 'undefined') {
      user.roles = dto.roles;
    }

    // 6) isActive
    if (typeof dto.isActive === 'boolean') {
      user.isActive = dto.isActive;
    }

    // 7) typeOfStaff
    if (typeof dto.typeOfStaff !== 'undefined') {
      user.typeOfStaff = dto.typeOfStaff ?? null;   // 👈 nuevo campo
    }

    // 8) Profile (crear o actualizar)
    if (hasProfileFields) {
      if (!user.profile) {
        // Si no existe perfil, lo creamos
        const employee_number =
          dto.profile?.firstName
            ? this.generateEmployeeNumber(dto.profile.firstName)
            : undefined;

        user.profile = this.profileRepo.create({
          ...dto.profile,
          // Genera employee_number solo en creación (opcional)
          employee_number: employee_number ?? undefined,
          user, // FK
        });
      } else {
        // Actualizamos solo los campos provistos
        Object.assign(user.profile, dto.profile);
        // ⚠️ Normalmente NO regeneres employee_number en updates
      }
    }

    // 9) Guardar (con cascade:true en @OneToOne se persiste el profile)
    const saved = await this.repo.save(user);

    // 10) Devolver con relación actualizada
    return this.repo.findOne({
      where: { id: saved.id },
      relations: { profile: true },
    }) as Promise<User>;
  }



  // Elimina y valida existencia
  async remove(id: string): Promise<void> {
    const { affected } = await this.repo.delete(id);
    if (!affected) throw new NotFoundException('User not found');
  }

  // Utilidad para Auth
  /* findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email: normalizeEmail(email) } });
  } */
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email: normalizeEmail(email) },
      relations: { profile: true }, // siempre trae el perfil
    });
  }


  // Guarda el hash del refresh (o null). Valida que el usuario exista.
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    const refreshTokenHash = refreshToken
      ? await bcrypt.hash(refreshToken, SALT_ROUNDS)
      : null;

    const result: UpdateResult = await this.repo.update(
      { id: userId },
      { refreshTokenHash },
    );

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  // users.service.ts
  async filter(dto: UsersFilterDto): Promise<User[]> {
    const qb = this.repo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'p')
      .orderBy('u.createdAt', 'DESC')

    // ✅ Filtro por isActive
    if (dto.isActive !== undefined) {
      qb.andWhere('u.isActive = :isActive', {
        isActive: dto.isActive === 'true',
      })
    }

    // ✅ Filtro por role (Postgres array: ANY)
    if (dto.role) {
      qb.andWhere(':role = ANY(u.roles)', { role: dto.role })
    }

    // ✅ Filtro por typeOfStaff
    if (dto.typeOfStaff) {
      qb.andWhere('u.typeOfStaff = :typeOfStaff', { typeOfStaff: dto.typeOfStaff })
    }

    return qb.getMany()
  }




}
