import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PayerDto, ProductDto } from "../dto/create-payment.dto";
import { EmployeeDto } from "../dto/update-payment.dto";


@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'jsonb' })
    customer: PayerDto;

    @Column({ type: 'jsonb' })
    product: ProductDto;

    @Column()
    isThirdParty: boolean;

    @Column({ type: 'jsonb', nullable: true })
    thirdParty: PayerDto;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    paymentTotal: number;

    @Column({ type: 'date' })
    createdDate: Date;

    @Column({ type: 'time' })
    createdTime: Date;

    @Column()
    createdBy: string;

    @Column({ type: 'date' })
    updatedDate: Date;

    @Column({ type: 'time' })
    updatedTime: Date;

    @Column({ type: 'jsonb', nullable: true })
    updatedBy: EmployeeDto[];
}
