import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('lead_sources')
export class LeadSource {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    source_id: string;

    @Column()
    source_name: string;

    @Column({ type: 'boolean', default: true })
    source_status: boolean;

    @Column()
    created_by: string;

    @Column({ type: 'date' })
    created_date: string;

    @Column({ type: 'time' })
    created_time: string;

    @Column()
    last_updated_by: string;

    @Column({ type: 'date' })
    updated_date: string;

    @Column({ type: 'time' })
    updated_time: string;

}