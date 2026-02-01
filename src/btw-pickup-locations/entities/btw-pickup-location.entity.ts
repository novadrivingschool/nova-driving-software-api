import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('btw_pickup_locations')
export class BtwPickupLocation {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    btw_pickup_id: string;

    @Column()
    btw_pickup_name: string;

    @Column({ type: 'boolean' })
    btw_pickup_status: boolean;

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