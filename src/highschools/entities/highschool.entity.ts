import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('highschools')
export class Highschool {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    highschool_id: string;

    @Column()
    highschool_name: string;

    @Column({ nullable: true })
    highschool_address: string;

    @Column({ type: 'boolean' })
    highschool_status: boolean;

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
