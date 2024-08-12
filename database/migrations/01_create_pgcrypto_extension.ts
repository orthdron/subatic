import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Dropping extensions is generally not supported in a reversible way in PostgreSQL.
}
