import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await sql`
    /* Source: https://github.com/viascom/nanoid-postgres/blob/main/nanoid.sql */

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21, alphabet text DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    RETURNS text
    LANGUAGE plpgsql
    volatile
AS
$$
DECLARE
    idBuilder     text := '';
    i             int  := 0;
    bytes         bytea;
    alphabetIndex int;
    mask          int;
    step          int;
BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
        loop
            bytes := gen_random_bytes(size);
            while i < size
                loop
                    alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                    if alphabetIndex <= length(alphabet) then
                        idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                        if length(idBuilder) = size then
                            return idBuilder;
                        end if;
                    end if;
                    i = i + 1;
                end loop;

            i := 0;
        end loop;
END
$$;
    `.execute(db);

    await db.schema
        .createType('video_status')
        .asEnum(['UPLOADING', 'USER_STATUS_UPLOADED', 'IN_QUEUE', 'PROCESSING', 'DONE', 'FAILED', 'REJECTED'])
        .execute();

    await db.schema
        .createTable('user')
        .addColumn('id', 'varchar', (col) => col.primaryKey().defaultTo(sql`nanoid(10, 'abcdefghijklmnopqrstuvwxyz')`))
        .addColumn('user_name', 'varchar', (col) => col.notNull().unique())
        .addColumn('email', 'varchar', (col) => col.notNull().unique())
        .addColumn('password_hash', 'varchar', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .execute()

    await db.schema
        .createTable('video')
        .addColumn('id', 'varchar', (col) => col.primaryKey().defaultTo(sql`nanoid(10, 'abcdefghijklmnopqrstuvwxyz')`))
        .addColumn('user_id', 'varchar', (col) => col.notNull().references('user.id'))
        .addColumn('title', 'varchar', (col) => col.notNull())
        .addColumn('description', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
        .addColumn('duration', 'integer')
        .addColumn('status', sql`video_status`, (col) => col.defaultTo('UPLOADING'))
        .execute();


    await db.schema
        .createTable('user_session')
        .addColumn('id', 'text', col => col.primaryKey())
        .addColumn('expires_at', 'timestamptz', col => col.notNull())
        .addColumn('user_id', 'text', col => col.references('user.id').notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('video').execute();
    await db.schema.dropType('video_status').execute();
    await sql`DROP FUNCTION IF EXISTS nanoid(int, text, float);`.execute(db);
    await db.schema.dropTable('user_session').execute();
    await db.schema.dropTable('user').execute();
}
