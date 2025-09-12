import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { setupUploadMock } from '@/test/utils/setup-upload-mock';
import { isRight, unwrapEither } from '@/shared/either';
import { getUploads } from './get-uploads';

describe('get uploads', () => {
  it('should be able to get the uploads', async () => {
    const namePattern = randomUUID();

    const upload1 = await setupUploadMock({ name: `${namePattern}.wep` });
    const upload2 = await setupUploadMock({ name: `${namePattern}.wep` });
    const upload3 = await setupUploadMock({ name: `${namePattern}.wep` });
    const upload4 = await setupUploadMock({ name: `${namePattern}.wep` });
    const upload5 = await setupUploadMock({ name: `${namePattern}.wep` });

    const sut = await getUploads({
      searchQuery: namePattern,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });

  it('should be able to get paginated uploads', async () => {
    const namePattern = randomUUID();

    const upload1 = await setupUploadMock({ name: `${namePattern}.wep` });
    const upload2 = await setupUploadMock({ name: `${namePattern}.wep` });
    const upload3 = await setupUploadMock({ name: `${namePattern}.wep` });
    const upload4 = await setupUploadMock({ name: `${namePattern}.wep` });
    const upload5 = await setupUploadMock({ name: `${namePattern}.wep` });

    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ]);

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });

  it('should be able to get sorted uploads', async () => {
    const namePattern = randomUUID();

    const upload1 = await setupUploadMock({
      name: `${namePattern}.wep`,
      createdAt: new Date(),
    });

    const upload2 = await setupUploadMock({
      name: `${namePattern}.wep`,
      createdAt: dayjs().subtract(1, 'day').toDate(),
    });

    const upload3 = await setupUploadMock({
      name: `${namePattern}.wep`,
      createdAt: dayjs().subtract(2, 'day').toDate(),
    });

    const upload4 = await setupUploadMock({
      name: `${namePattern}.wep`,
      createdAt: dayjs().subtract(3, 'day').toDate(),
    });

    const upload5 = await setupUploadMock({
      name: `${namePattern}.wep`,
      createdAt: dayjs().subtract(4, 'day').toDate(),
    });

    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id }),
    ]);

    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut).total).toEqual(5);
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });
});
