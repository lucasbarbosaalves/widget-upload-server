import { env } from '@/env';
import fastifyCors from '@fastify/cors';
import { log } from 'console';
import fastify from 'fastify';

const server = fastify();

server.register(fastifyCors, { origin: '*' });

log(env.DATABASE_URL)

server.listen({ port: 3000, host: '0.0.0.0' }).then(() => {
  log('HTTP Server Running on');
});
