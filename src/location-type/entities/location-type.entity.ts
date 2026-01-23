import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('location_type')
export class LocationType {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    id: string;

    @Column()
    type_name: string;

    @Column({ type: 'date' })
    created_date: string;

    @Column({ type: 'time' })
    created_time: string;


    @Column({ type: 'date' })
    updated_date: string;

    @Column({ type: 'time' })
    updated_time: string;
}