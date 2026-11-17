// import { boolean } from "drizzle-orm/cockroach-core";
import { pgTable, serial, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
    id: serial('id').primaryKey(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull(),
    imageUrl:varchar('imageUrl'),
    subscription:boolean('subscription'). default(false),
    credits:integer('credits').default(30) // 10 credits per video
})

export const VideoData = pgTable('videoData', {
    id: serial('id').primaryKey(),
    createdBy:varchar('createdBy').notNull(),
    videoScript:varchar('videoScript').notNull(),
    audioUrl:varchar('audioUrl').notNull(),
    audioCaption:varchar('audioCaption').notNull(),
    imageUrls:varchar('imageUrls').array(),
}) 