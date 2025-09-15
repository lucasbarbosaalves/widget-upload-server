import { uploadImage } from '@/app/services/upload-image';
import { isRight, unwrapEither } from '@/shared/either';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

export const uploadImageRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        tags: ['uploads'],
        consumes: ['multipart/form-data'],
        response: {
          201: z.string().describe('Image uploaded'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, // 2mb
        },
      });

      if (!uploadedFile) {
        return reply.status(400).send({ message: 'File is required.' });
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      });

      if (uploadedFile.file.truncated) {
        return reply.status(400).send({ message: 'File size limit reached.' });
      }

      if (isRight(result)) {
        return reply.status(201).send(result.right.url);
      }

      const err = unwrapEither(result);

      switch (err.constructor.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: err.message });
      }
    }
  );
};
