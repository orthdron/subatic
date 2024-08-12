import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('user')
        .addColumn('id', 'varchar', (col) => col.primaryKey().defaultTo(sql`nanoid(10, 'abcdefghijklmnopqrstuvwxyz0123456789')`))
        .addColumn('user_name', 'varchar', (col) => col.notNull().unique())
        .addColumn('email', 'varchar', (col) => col.notNull().unique())
        .addColumn('password_hash', 'varchar', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('user').execute();
}
