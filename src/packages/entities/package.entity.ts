import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('packages')
export class Package {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    price: number;

    @Column({ nullable: true })
    description: string;
}
