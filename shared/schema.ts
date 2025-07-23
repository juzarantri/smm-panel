import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  balance: integer("balance").default(0), // in cents
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  // JustAnotherPanel integration fields
  externalId: integer("external_id"), // JustAnotherPanel service ID
  serviceType: text("service_type"), // type from external API
  rate: text("rate"), // original rate from external API
  refillSupported: boolean("refill_supported").default(false),
  cancelSupported: boolean("cancel_supported").default(false),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  serviceId: integer("service_id").references(() => services.id),
  quantity: integer("quantity").notNull(),
  targetUrl: text("target_url").notNull(),
  status: text("status").notNull(), // pending, processing, completed, cancelled
  totalPrice: integer("total_price").notNull(), // in cents
  startCount: integer("start_count"),
  remainingCount: integer("remaining_count"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  // JustAnotherPanel integration fields
  externalOrderId: integer("external_order_id"), // Order ID from JustAnotherPanel
  externalCharge: text("external_charge"), // Charge amount from external API
  externalCurrency: text("external_currency"), // Currency from external API
  // Additional order parameters for different service types
  orderParams: jsonb("order_params"), // Store additional parameters like keywords, comments, etc.
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
  externalId: true,
  serviceType: true,
  rate: true,
  refillSupported: true,
  cancelSupported: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  serviceId: true,
  quantity: true,
  targetUrl: true,
  totalPrice: true,
  orderParams: true,
}).extend({
  // Additional validation for order parameters
  orderParams: z.record(z.any()).optional(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
