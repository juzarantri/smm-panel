import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  googleId: text("google_id").unique(),
  balance: integer("balance").default(0), // in cents
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").default(0),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => serviceCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // price per 1000 in cents
  minQuantity: integer("min_quantity").default(1),
  maxQuantity: integer("max_quantity").default(100000),
  isActive: boolean("is_active").default(true),
  deliveryTime: text("delivery_time"), // e.g., "1-24 hours"
  features: text("features").array(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  serviceId: integer("service_id").references(() => services.id),
  quantity: integer("quantity").notNull(),
  targetUrl: text("target_url").notNull(),
  status: text("status").notNull(), // pending, processing, completed, cancelled
  totalPrice: integer("total_price").notNull(), // in cents
  startCount: integer("start_count"),
  remainingCount: integer("remaining_count"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  avatar: true,
  googleId: true,
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).pick({
  name: true,
  slug: true,
  icon: true,
  color: true,
  description: true,
  orderIndex: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  categoryId: true,
  name: true,
  description: true,
  price: true,
  minQuantity: true,
  maxQuantity: true,
  deliveryTime: true,
  features: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  serviceId: true,
  quantity: true,
  targetUrl: true,
  totalPrice: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
