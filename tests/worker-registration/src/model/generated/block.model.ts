import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

/**
 * This is GraphQL schema file. It is generated automatically by the squid-gen tool.
 * Each type corresponds to an entity in the database, a GraphQL type and an event/function on the contract.
 * Feel free to change the schema to fit your needs, and run `npx sqd codegen` to regenerate the models.
 */
@Entity_()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    number!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}
