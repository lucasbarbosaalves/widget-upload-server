import { randomUUID } from 'crypto';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const uploads = pgTable('uploads', {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  remoteKey: text('remote_key').notNull().unique(),
  remoteUrl: text('remote_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
