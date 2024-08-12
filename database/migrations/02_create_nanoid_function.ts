import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await sql`
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
}

export async function down(db: Kysely<any>): Promise<void> {
    await sql`DROP FUNCTION IF EXISTS nanoid(int, text);`.execute(db);
}
