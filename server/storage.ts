import {
  users,
  serviceCategories,
  services,
  orders,
  type User,
  type UpsertUser,
  type ServiceCategory,
  type InsertServiceCategory,
  type Service,
  type InsertService,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { justAnotherPanelApi } from "./justAnotherPanelApi";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Service category operations
  getAllServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;

  // Service operations
  getAllServices(): Promise<Service[]>;
  getServicesByCategory(categoryId: number): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Order operations
  getAllOrders(): Promise<Order[]>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // JustAnotherPanel integration methods
  createExternalOrder(order: InsertOrder & { userId: string }): Promise<Order>;
  syncOrderStatus(orderId: number): Promise<Order | undefined>;
  refillOrder(orderId: number): Promise<{ success: boolean; message: string }>;
  cancelOrder(orderId: number): Promise<{ success: boolean; message: string }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Service category operations
  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories).orderBy(serviceCategories.orderIndex);
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return category;
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const [newCategory] = await db
      .insert(serviceCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  // Service operations
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true));
  }

  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return await db.select().from(services)
      .where(eq(services.categoryId, categoryId));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db
      .insert(services)
      .values(service)
      .returning();
    return newService;
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(insertOrder: InsertOrder & { userId: string }): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values({
        ...insertOrder,
        status: "pending",
      })
      .returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ 
        status,
        completedAt: status === "completed" ? new Date() : undefined 
      })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // JustAnotherPanel integration methods
  async createExternalOrder(insertOrder: InsertOrder & { userId: string }): Promise<Order> {
    try {
      // First get the service to check if it has an external ID
      const service = await this.getService(insertOrder.serviceId);
      if (!service || !service.externalId) {
        throw new Error("Service not found or not available through external provider");
      }

      // Prepare the order data for JustAnotherPanel
      const externalOrderData: any = {
        service: service.externalId!,
        link: insertOrder.targetUrl,
        quantity: insertOrder.quantity,
      };

      // Add additional parameters if provided
      if (insertOrder.orderParams) {
        Object.assign(externalOrderData, insertOrder.orderParams);
      }

      // Create order in JustAnotherPanel
      const externalResponse = await justAnotherPanelApi.order(externalOrderData);
      
      if (externalResponse.error) {
        throw new Error(`External provider error: ${externalResponse.error}`);
      }

      // Create order in our database with external order ID
      const [order] = await db
        .insert(orders)
        .values({
          ...insertOrder,
          status: "pending",
          externalOrderId: externalResponse.order || null,
          externalCharge: externalResponse.charge?.toString() || null,
          externalCurrency: externalResponse.currency || null,
        })
        .returning();

      return order;
    } catch (error) {
      console.error("Error creating external order:", error);
      throw error;
    }
  }

  async syncOrderStatus(orderId: number): Promise<Order | undefined> {
    try {
      const order = await this.getOrder(orderId);
      if (!order || !order.externalOrderId) {
        return order;
      }

      // Get status from JustAnotherPanel
      const externalStatus = await justAnotherPanelApi.status(order.externalOrderId!);
      
      if (externalStatus.error) {
        console.error(`Error syncing order ${orderId}:`, externalStatus.error);
        return order;
      }

      // Map external status to our status
      let newStatus = order.status;
      if (externalStatus.status === "Completed") {
        newStatus = "completed";
      } else if (externalStatus.status === "In progress") {
        newStatus = "processing";
      } else if (externalStatus.status === "Pending") {
        newStatus = "pending";
      } else if (externalStatus.status === "Canceled") {
        newStatus = "cancelled";
      }

      // Update order in our database
      const [updatedOrder] = await db
        .update(orders)
        .set({
          status: newStatus,
          startCount: externalStatus.start_count || order.startCount,
          remainingCount: externalStatus.remains || order.remainingCount,
          completedAt: newStatus === "completed" ? new Date() : order.completedAt,
        })
        .where(eq(orders.id, orderId))
        .returning();

      return updatedOrder;
    } catch (error) {
      console.error("Error syncing order status:", error);
      return undefined;
    }
  }

  async refillOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    try {
      const order = await this.getOrder(orderId);
      if (!order || !order.externalOrderId) {
        return { success: false, message: "Order not found or not from external provider" };
      }

      const service = await this.getService(order.serviceId);
      if (!service?.refillSupported) {
        return { success: false, message: "Refill not supported for this service" };
      }

      const refillResponse = await justAnotherPanelApi.refill(order.externalOrderId!);
      
      if (refillResponse.error) {
        return { success: false, message: refillResponse.error };
      }

      return { success: true, message: "Refill request submitted successfully" };
    } catch (error) {
      console.error("Error requesting refill:", error);
      return { success: false, message: "Failed to request refill" };
    }
  }

  async cancelOrder(orderId: number): Promise<{ success: boolean; message: string }> {
    try {
      const order = await this.getOrder(orderId);
      if (!order || !order.externalOrderId) {
        return { success: false, message: "Order not found or not from external provider" };
      }

      const service = await this.getService(order.serviceId);
      if (!service?.cancelSupported) {
        return { success: false, message: "Cancellation not supported for this service" };
      }

      const cancelResponse = await justAnotherPanelApi.cancel([order.externalOrderId!]);
      
      if (Array.isArray(cancelResponse) && cancelResponse.length > 0 && cancelResponse[0].error) {
        return { success: false, message: cancelResponse[0].error };
      }

      // Update order status to cancelled
      await this.updateOrderStatus(orderId, "cancelled");

      return { success: true, message: "Order cancelled successfully" };
    } catch (error) {
      console.error("Error cancelling order:", error);
      return { success: false, message: "Failed to cancel order" };
    }
  }
}

export const storage = new DatabaseStorage();
