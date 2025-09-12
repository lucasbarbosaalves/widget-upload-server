import { db, pg } from '@/infra/db';
import { schema } from '@/infra/db/schemas/ìndex';
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage';
import { Either, makeRight } from '@/shared/either';
import { stringify } from 'csv-stringify';
import { ilike } from 'drizzle-orm';
import { PassThrough, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import z from 'zod';

const exportUploadsInput = z.object({
  searchQuery: z.string().optional(),
});
type exportUploadsInput = z.input<typeof exportUploadsInput>;

type exportUploadsOutput = {
  reportUrl: string;
};

export async function exportUploads(input: exportUploadsInput): Promise<Either<never, exportUploadsOutput>> {
  const { searchQuery } = exportUploadsInput.parse(input);

  const { sql, params } = db
    .select({
      id: schema.uploads.id,
      name: schema.uploads.name,
      remoteUrl: schema.uploads.remoteUrl,
      createdAt: schema.uploads.createdAt,
    })
    .from(schema.uploads)
    .where(searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined)
    .toSQL();

  // Cursor Postgres
  const cursor = pg.unsafe(sql, params as string[]).cursor(50);

  for await (const rows of cursor) {
    console.log(rows);
  }

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'NAME' },
      { key: 'remote_url', header: 'URL' },
      { key: 'createdAt', header: 'Uploaded_at' },
    ],
  });

  const uploadToStorageStream = new PassThrough();

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }

        callback();
      },
    }),
    csv,
    uploadToStorageStream
  );
  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream,
  });

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

  console.log(url);

  return makeRight({ reportUrl: '' });
}
