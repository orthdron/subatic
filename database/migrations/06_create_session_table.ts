import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('user_session')
        .addColumn('id', 'text', col => col.primaryKey())
        .addColumn('expires_at', 'timestamptz', col => col.notNull())
        .addColumn('user_id', 'text', col => col.references('user.id').notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('user_session').execute();
}
