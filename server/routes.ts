import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { seedDatabase } from "./seed";
import { serviceSyncManager } from "./serviceSync";
import { justAnotherPanelApi } from "./justAnotherPanelApi";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed database
  await seedDatabase();
  
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Get all service categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get services by category
  app.get("/api/categories/:categoryId/services", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const services = await storage.getServicesByCategory(categoryId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get user orders (protected route)
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Create new order (protected route) - Now uses JustAnotherPanel API
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOrderSchema.parse(req.body);
      const orderData = {
        ...validatedData,
        userId,
      };
      
      // Use the new external order creation method
      const order = await storage.createExternalOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  // Get order by ID
  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Sync order status with JustAnotherPanel
  app.post("/api/orders/:orderId/sync", isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const order = await storage.syncOrderStatus(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to sync order status" });
    }
  });

  // Refill order
  app.post("/api/orders/:orderId/refill", isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const result = await storage.refillOrder(orderId);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to request refill" });
    }
  });

  // Cancel order
  app.post("/api/orders/:orderId/cancel", isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const result = await storage.cancelOrder(orderId);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel order" });
    }
  });

  // Admin route: Sync services from JustAnotherPanel
  app.post("/api/admin/sync-services", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin (you might want to add proper admin check)
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      await serviceSyncManager.syncServicesFromJustAnotherPanel();
      res.json({ message: "Services synchronized successfully" });
    } catch (error) {
      console.error("Service sync error:", error);
      res.status(500).json({ message: "Failed to sync services" });
    }
  });

  // Get provider balance
  app.get("/api/admin/provider-balance", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const balance = await serviceSyncManager.getProviderBalance();
      res.json(balance);
    } catch (error) {
      console.error("Provider balance error:", error);
      res.status(500).json({ message: "Failed to fetch provider balance" });
    }
  });

  // Get order status from external provider
  app.get("/api/orders/:orderId/external-status", isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const order = await storage.getOrder(orderId);
      if (!order || !order.externalOrderId) {
        return res.status(404).json({ message: "External order not found" });
      }

      const externalStatus = await justAnotherPanelApi.status(order.externalOrderId);
      res.json(externalStatus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch external order status" });
    }
  });

  // Bulk operations for orders
  app.post("/api/orders/bulk/sync", isAuthenticated, async (req: any, res) => {
    try {
      const { orderIds } = req.body;
      if (!Array.isArray(orderIds)) {
        return res.status(400).json({ message: "Order IDs array required" });
      }

      const results = [];
      for (const orderId of orderIds) {
        try {
          const order = await storage.syncOrderStatus(parseInt(orderId));
          results.push({ orderId, success: true, order });
        } catch (error) {
          results.push({ orderId, success: false, error: (error as Error).message });
        }
      }

      res.json({ results });
    } catch (error) {
      res.status(500).json({ message: "Failed to bulk sync orders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
