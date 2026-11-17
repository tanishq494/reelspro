import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: 'postgresql',
  schema: './configs/schema.js',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_CHjJ8nE2FZqm@ep-dry-mouse-b5xgx106-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  }
})