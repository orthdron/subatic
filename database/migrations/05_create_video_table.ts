import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('video')
        .addColumn('id', 'varchar', (col) => col.primaryKey().defaultTo(sql`nanoid(10, 'abcdefghijklmnopqrstuvwxyz0123456789')`))
        .addColumn('user_id', 'varchar', (col) => col.notNull().references('user.id'))
        .addColumn('title', 'varchar', (col) => col.notNull())
        .addColumn('description', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
        .addColumn('last_status_update', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
        .addColumn('duration', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('status', sql`video_status`, (col) => col.defaultTo('UPLOADING').notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('video').execute();
}
