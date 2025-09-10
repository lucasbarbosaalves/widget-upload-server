import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas/ìndex';
import { Either, makeLeft, makeRight } from '@/shared/either';
import { Readable } from 'node:stream';
import z from 'zod';
import { InvalidFileFormat } from './errors/invalid-file-format';

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadImageInput = z.input<typeof uploadImageInput>;

const allowedFormatFiles = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export async function uploadImage(input: UploadImageInput): Promise<Either<InvalidFileFormat, { url: string }>> {
  const { contentStream, contentType, fileName } = uploadImageInput.parse(input);

  if (!allowedFormatFiles) {
    return makeLeft(new InvalidFileFormat());
  }

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: fileName,
    remoteUrl: fileName,
  });

  return makeRight({ url: '' });
}
