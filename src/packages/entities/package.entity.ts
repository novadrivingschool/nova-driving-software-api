import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('packages')
export class Package {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    package_name: string;

    @Column({ unique: true })
    package_code: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    package_price: number;

    @Column()
    package_status: boolean;

    @Column({ nullable: true })
    package_description: string;

    @Column({ type: "jsonb" })
    package_locations: string[];

    @Column({ nullable: true })
    package_web_name: string;

    @Column({ nullable: true })
    package_web_description: string;

    @Column()
    created_by: string;

    @Column({ type: 'date' })
    created_date: string;

    @Column({ type: 'time' })
    created_time: string;

    @Column({ type: 'date' })
    updated_date: string;

    @Column({ type: 'time' })
    updated_time: string;

    @Column()
    last_updated_by: string;
}
