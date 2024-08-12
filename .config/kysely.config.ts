import { CamelCasePlugin, PostgresDialect } from 'kysely';
import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg';

export default defineConfig({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.DATABASE_URL as string,
		}),
	}),
	migrations: {
		migrationFolder: "database/migrations",
	},
	plugins: [new CamelCasePlugin()],
})
