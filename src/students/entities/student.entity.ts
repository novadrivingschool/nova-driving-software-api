import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('students')
export class Student {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    btw_pickup_location: string;

    @Column()
    student_first_name: string;

    @Column({ nullable: true })
    student_middle_name: string;

    @Column()
    student_last_name: string;

    @Column()
    student_address: string;

    @Column()
    student_city: string;

    @Column()
    student_state: string;

    @Column()
    student_zip_code: string;

    @Column()
    student_email: string;

    @Column()
    student_phone_number: string;

    @Column({ nullable: true })
    student_other_phone_number: string;

    @Column()
    student_sex: string;

    @Column({ type: 'date' })
    student_birth_date: string;

    @Column({ nullable: true })
    student_permit_number: string;

    @Column({ type: 'text', nullable: true })
    student_medical_conditions: string;

    @Column({ type: 'date', nullable: true })
    student_permit_issued: string;

    @Column({ type: 'date', nullable: true })
    student_permit_expiration: string;


    @Column()
    student_high_school: string;

    @Column()
    student_parent_name: string;

    @Column()
    student_parent_phone: string;

    @Column({ nullable: true })
    student_parent_email: string;

    @Column()
    student_lead_source: string;

    @Column({ type: 'text', nullable: true })
    student_driving_notes: string;

    @Column()
    student_tshirt_size: string;

    @Column({ type: 'date' })
    created_date: string;

    @Column({ type: 'time' })
    created_time: string;

    @Column()
    created_by: string;

    @Column({ type: 'date' })
    updated_date: string;

    @Column({ type: 'time' })
    updated_time: string;

    @Column()
    last_updated_by: string;
}