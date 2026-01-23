import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LocationStatus } from '../dto/create-location.dto';

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    location_name: string;

    @Column({ unique: true })
    location_code: string;

    @Column({
        type: 'enum',
        enum: LocationStatus,
        default: LocationStatus.PENDING
    })
    location_status: LocationStatus;

    @Column()
    location_type: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    zip_code: string;

    @Column({ type: 'date' })
    created_date: string;

    @Column({ type: 'time' })
    created_time: string;


    @Column({ type: 'date' })
    updated_date: string;

    @Column({ type: 'time' })
    updated_time: string;
}