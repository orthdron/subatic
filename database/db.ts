import "dotenv/config";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { type DB } from "./kysely-types";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL as string,
});

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool,
    }),
    plugins: [new CamelCasePlugin()],
});