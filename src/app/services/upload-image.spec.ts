import { beforeAll, describe, expect, it, vi } from 'vitest';
import { uploadImage } from './upload-image';
import { Readable } from 'node:stream';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { randomUUID } from 'node:crypto';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas/ìndex';
import { eq } from 'drizzle-orm';
import { InvalidFileFormat } from './errors/invalid-file-format';

describe('Upload Image Test (E2E)', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: 'https://storage.com/image.jpg',
          };
        }),
      };
    });
  });

  it('should be able to upload an image', async () => {
    const fileName = `${randomUUID()}.jpg`;
    const result = await uploadImage({
      fileName: fileName,
      contentType: 'image/jpg',
      contentStream: Readable.from([]),
    });

    expect(isRight(result)).toBe(true);

    const sut = await db.select().from(schema.uploads).where(eq(schema.uploads.name, fileName));

    expect(sut).toHaveLength(1);
  });

  it('should not be able to upload an invalid file', async () => {
    const fileName = `${randomUUID()}.pdf`;
    const result = await uploadImage({
      fileName: fileName,
      contentType: 'document/pdf',
      contentStream: Readable.from([]),
    });

    console.log(result);

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(InvalidFileFormat);
  });
});
