import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createType('video_status')
        .asEnum(['UPLOADING', 'DONE', 'FAILED', 'UPLOADED', 'PROCESSING'])
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropType('video_status').execute();
}