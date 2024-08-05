/* Source: https://github.com/viascom/nanoid-postgres/blob/main/nanoid.sql */

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION nanoid(
    size int DEFAULT 21,
    alphabet text DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
) 
RETURNS text 
LANGUAGE plpgsql 
VOLATILE 
AS $$
DECLARE 
    idBuilder text := '';
    i int := 0;
    bytes bytea;
    alphabetIndex int;
    mask int;
    step int;
BEGIN 
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    WHILE true LOOP 
        bytes := gen_random_bytes(size);
        
        WHILE i < size LOOP 
            alphabetIndex := (get_byte(bytes, i) & mask) + 1;

            IF alphabetIndex <= length(alphabet) THEN 
                idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);

                IF length(idBuilder) = size THEN 
                    RETURN idBuilder;
                END IF;
            END IF;

            i := i + 1;
        END LOOP;

        i := 0;
    END LOOP;
END $$;

CREATE TABLE public."user" (
    id varchar DEFAULT nanoid(10, 'abcdefghijklmnopqrstuvwxyz0123456789'::text) NOT NULL,
    user_name varchar NOT NULL,
    email varchar NOT NULL,
    password_hash varchar NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
    CONSTRAINT user_email_key UNIQUE (email),
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_user_name_key UNIQUE (user_name)
);

CREATE TABLE public.user_session (
    id text NOT NULL,
    expires_at timestamptz NOT NULL,
    user_id text NOT NULL,
    CONSTRAINT user_session_pkey PRIMARY KEY (id),
    CONSTRAINT user_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id)
);

CREATE TABLE public.video (
    id varchar DEFAULT nanoid(10, 'abcdefghijklmnopqrstuvwxyz0123456789'::text) NOT NULL,
    user_id varchar NOT NULL,
    title varchar NOT NULL,
    description varchar NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
    duration int4 DEFAULT 0 NOT NULL,
    status public."video_status" DEFAULT 'UPLOADING'::video_status NOT NULL,
    CONSTRAINT video_pkey PRIMARY KEY (id),
    CONSTRAINT video_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id)
);
