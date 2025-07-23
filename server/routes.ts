import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { seedDatabase } from "./seed";
import { serviceSyncManager } from "./serviceSync";
import { justAnotherPanelApi } from "./justAnotherPanelApi";

export async function registerRoutes(app: Express): Promise<Server> {
  // No seeding - all data comes from JustAnotherPanel
  
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
  // Get all service categories dynamically from JustAnotherPanel
  app.get("/api/categories", async (req, res) => {
    try {
      const services = await justAnotherPanelApi.services();
      
      // Extract unique categories from services
      const categoryMap = new Map();
      services.forEach(service => {
        const categoryName = service.category;
        if (!categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, {
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            serviceCount: 0
          });
        }
        categoryMap.get(categoryName).serviceCount++;
      });
      
      const categories = Array.from(categoryMap.values())
        .sort((a, b) => b.serviceCount - a.serviceCount); // Sort by service count
      
      res.json(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all services from JustAnotherPanel
  app.get("/api/services", async (req, res) => {
    try {
      const services = await justAnotherPanelApi.services();
      
      // Transform services to our format with markup pricing
      const transformedServices = services.map(service => ({
        id: service.service,
        externalId: service.service,
        name: service.name,
        description: service.description || `${service.name} - ${service.category}`,
        category: service.category,
        price: Math.round(parseFloat(service.rate || '0') * 120), // 20% markup in cents
        rate: service.rate,
        minQuantity: parseInt(service.min) || 1,
        maxQuantity: parseInt(service.max) || 100000,
        serviceType: service.type,
        refillSupported: service.refill === true || service.refill === 1,
        cancelSupported: service.cancel === true || service.cancel === 1,
        isActive: true
      }));
      
      res.json(transformedServices);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get services by category from JustAnotherPanel
  app.get("/api/categories/:categoryName/services", async (req, res) => {
    try {
      const categoryName = decodeURIComponent(req.params.categoryName);
      const allServices = await justAnotherPanelApi.services();
      
      // Filter services by category
      const categoryServices = allServices
        .filter(service => service.category.toLowerCase() === categoryName.toLowerCase())
        .map(service => ({
          id: service.service,
          externalId: service.service,
          name: service.name,
          description: service.description || `${service.name} - ${service.category}`,
          category: service.category,
          price: Math.round(parseFloat(service.rate || '0') * 120), // 20% markup in cents
          rate: service.rate,
          minQuantity: parseInt(service.min) || 1,
          maxQuantity: parseInt(service.max) || 100000,
          serviceType: service.type,
          refillSupported: service.refill === true || service.refill === 1,
          cancelSupported: service.cancel === true || service.cancel === 1,
          isActive: true
        }));
      
      res.json(categoryServices);
    } catch (error) {
      console.error("Failed to fetch services for category:", error);
      res.status(500).json({ message: "Failed to fetch services for category" });
    }
  });

  // Get service categories for a specific platform
  app.get("/api/platforms/:platform/categories", async (req, res) => {
    try {
      const { platform } = req.params;
      const allServices = await justAnotherPanelApi.services();
      
      // Filter services for the specific platform
      const platformServices = allServices.filter(service => {
        const category = service.category.toLowerCase();
        const platformLower = platform.toLowerCase();
        
        if (platformLower === 'instagram') return category.includes('instagram');
        if (platformLower === 'facebook') return category.includes('facebook');
        if (platformLower === 'youtube') return category.includes('youtube');
        if (platformLower === 'tiktok') return category.includes('tiktok');
        if (platformLower === 'x (twitter)') return category.includes('twitter') || category.includes('x.com');
        if (platformLower === 'telegram') return category.includes('telegram');
        if (platformLower === 'discord') return category.includes('discord');
        if (platformLower === 'linkedin') return category.includes('linkedin');
        if (platformLower === 'snapchat') return category.includes('snapchat');
        if (platformLower === 'spotify') return category.includes('spotify');
        if (platformLower === 'google') return category.includes('google');
        if (platformLower === 'twitch') return category.includes('twitch');
        if (platformLower === 'website traffic') return category.includes('traffic');
        if (platformLower === 'reviews') return category.includes('reviews');
        return false;
      });

      // Extract unique service categories for this platform
      const serviceCategories = new Set<string>();
      platformServices.forEach(service => {
        serviceCategories.add(service.category);
      });

      const categories = Array.from(serviceCategories).map(categoryName => ({
        name: categoryName,
        serviceCount: platformServices.filter(s => s.category === categoryName).length
      }));

      res.json(categories);
    } catch (error) {
      console.error("Error fetching platform categories:", error);
      res.status(500).json({ message: "Failed to fetch platform categories" });
    }
  });

  // Get services for a specific platform and category
  app.get("/api/platforms/:platform/categories/:category/services", async (req, res) => {
    try {
      const { platform, category } = req.params;
      const allServices = await justAnotherPanelApi.services();
      
      // Filter services for the specific platform and category
      const filteredServices = allServices.filter(service => {
        const serviceCategory = service.category.toLowerCase();
        const platformLower = platform.toLowerCase();
        const categoryDecoded = decodeURIComponent(category);
        
        // Check if service belongs to platform
        let belongsToPlatform = false;
        if (platformLower === 'instagram') belongsToPlatform = serviceCategory.includes('instagram');
        else if (platformLower === 'facebook') belongsToPlatform = serviceCategory.includes('facebook');
        else if (platformLower === 'youtube') belongsToPlatform = serviceCategory.includes('youtube');
        else if (platformLower === 'tiktok') belongsToPlatform = serviceCategory.includes('tiktok');
        else if (platformLower === 'x (twitter)') belongsToPlatform = serviceCategory.includes('twitter') || serviceCategory.includes('x.com');
        else if (platformLower === 'telegram') belongsToPlatform = serviceCategory.includes('telegram');
        else if (platformLower === 'discord') belongsToPlatform = serviceCategory.includes('discord');
        else if (platformLower === 'linkedin') belongsToPlatform = serviceCategory.includes('linkedin');
        else if (platformLower === 'snapchat') belongsToPlatform = serviceCategory.includes('snapchat');
        else if (platformLower === 'spotify') belongsToPlatform = serviceCategory.includes('spotify');
        else if (platformLower === 'google') belongsToPlatform = serviceCategory.includes('google');
        else if (platformLower === 'twitch') belongsToPlatform = serviceCategory.includes('twitch');
        else if (platformLower === 'website traffic') belongsToPlatform = serviceCategory.includes('traffic');
        else if (platformLower === 'reviews') belongsToPlatform = serviceCategory.includes('reviews');
        
        return belongsToPlatform && service.category === categoryDecoded;
      });

      // Apply 20% markup to prices and transform
      const servicesWithMarkup = filteredServices.map(service => ({
        id: service.service,
        externalId: service.service,
        name: service.name,
        description: service.description || `${service.name} - ${service.category}`,
        category: service.category,
        price: Math.round(parseFloat(service.rate || '0') * 120), // 20% markup in cents
        rate: service.rate,
        minQuantity: parseInt(service.min) || 1,
        maxQuantity: parseInt(service.max) || 100000,
        serviceType: service.type,
        refillSupported: service.refill === true || service.refill === 1,
        cancelSupported: service.cancel === true || service.cancel === 1,
        isActive: true
      }));

      res.json(servicesWithMarkup);
    } catch (error) {
      console.error("Error fetching services for platform category:", error);
      res.status(500).json({ message: "Failed to fetch services for platform category" });
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

  // Create new order (protected route) - Direct JustAnotherPanel API
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { serviceId, link, quantity, customInputs } = req.body;
      
      if (!serviceId || !link || !quantity) {
        return res.status(400).json({ message: "Service ID, link, and quantity are required" });
      }

      // Get service details from JustAnotherPanel to calculate price
      const allServices = await justAnotherPanelApi.services();
      const service = allServices.find(s => s.service === parseInt(serviceId));
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      // Calculate total price with 20% markup
      const basePrice = parseFloat(service.rate) || 0;
      const totalPrice = Math.round(basePrice * (quantity / 1000) * 120); // 20% markup in cents

      // Prepare order data for JustAnotherPanel
      const orderData: any = {
        service: parseInt(serviceId),
        link: link,
        quantity: parseInt(quantity)
      };

      // Add custom inputs based on service type
      if (customInputs) {
        Object.assign(orderData, customInputs);
      }

      // Create order on JustAnotherPanel
      const externalOrder = await justAnotherPanelApi.order(orderData);
      
      if (!externalOrder.order) {
        return res.status(400).json({ 
          message: externalOrder.error || "Failed to create order with provider" 
        });
      }

      // Store order in our database
      const order = await storage.createDirectOrder({
        userId,
        serviceId: parseInt(serviceId),
        serviceName: service.name,
        link,
        quantity: parseInt(quantity),
        totalPrice,
        externalOrderId: parseInt(externalOrder.order),
        status: 'pending'
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
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
