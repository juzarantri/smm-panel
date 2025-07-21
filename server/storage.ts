import { users, serviceCategories, services, orders, type User, type InsertUser, type ServiceCategory, type InsertServiceCategory, type Service, type InsertService, type Order, type InsertOrder } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

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
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private serviceCategories: Map<number, ServiceCategory> = new Map();
  private services: Map<number, Service> = new Map();
  private orders: Map<number, Order> = new Map();
  private currentUserId = 1;
  private currentCategoryId = 1;
  private currentServiceId = 1;
  private currentOrderId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample categories
    const categories: ServiceCategory[] = [
      { id: 1, name: "Instagram", slug: "instagram", icon: "fab fa-instagram", color: "from-pink-500 to-purple-600", description: "Followers, Likes, Views, Comments, Stories", orderIndex: 1 },
      { id: 2, name: "YouTube", slug: "youtube", icon: "fab fa-youtube", color: "from-red-500 to-red-600", description: "Views, Subscribers, Likes, Watch Time", orderIndex: 2 },
      { id: 3, name: "TikTok", slug: "tiktok", icon: "fab fa-tiktok", color: "from-black to-gray-800", description: "Followers, Likes, Views, Shares", orderIndex: 3 },
      { id: 4, name: "Facebook", slug: "facebook", icon: "fab fa-facebook", color: "from-blue-600 to-blue-700", description: "Page Likes, Post Likes, Followers", orderIndex: 4 },
      { id: 5, name: "Twitter", slug: "twitter", icon: "fab fa-twitter", color: "from-blue-400 to-blue-600", description: "Followers, Likes, Retweets, Views", orderIndex: 5 },
      { id: 6, name: "Spotify", slug: "spotify", icon: "fab fa-spotify", color: "from-green-500 to-green-600", description: "Plays, Followers, Monthly Listeners", orderIndex: 6 },
      { id: 7, name: "LinkedIn", slug: "linkedin", icon: "fab fa-linkedin", color: "from-blue-600 to-indigo-700", description: "Connections, Post Likes, Followers", orderIndex: 7 },
      { id: 8, name: "Others", slug: "others", icon: "fas fa-ellipsis-h", color: "from-gray-600 to-gray-800", description: "Discord, Telegram, Reddit & More", orderIndex: 8 },
    ];

    categories.forEach(category => {
      this.serviceCategories.set(category.id, category);
    });
    this.currentCategoryId = categories.length + 1;

    // Initialize with sample services
    const sampleServices: Service[] = [
      { id: 1, categoryId: 1, name: "Instagram Followers - Real & Active", description: "High-quality followers from real accounts", price: 1250, minQuantity: 100, maxQuantity: 50000, isActive: true, deliveryTime: "1-24 hours", features: ["Real accounts", "No drop guarantee", "Fast delivery"] },
      { id: 2, categoryId: 1, name: "Instagram Likes - Instant", description: "Get instant likes on your posts", price: 50, minQuantity: 50, maxQuantity: 10000, isActive: true, deliveryTime: "0-1 hours", features: ["Instant start", "High retention", "Safe"] },
      { id: 3, categoryId: 2, name: "YouTube Views - High Retention", description: "Quality views with high retention rate", price: 200, minQuantity: 1000, maxQuantity: 100000, isActive: true, deliveryTime: "2-6 hours", features: ["High retention", "Safe for monetization", "Gradual delivery"] },
      { id: 4, categoryId: 2, name: "YouTube Subscribers - Permanent", description: "Permanent subscribers that won't drop", price: 2500, minQuantity: 50, maxQuantity: 5000, isActive: true, deliveryTime: "1-3 days", features: ["Permanent", "Real accounts", "No drop"] },
    ];

    sampleServices.forEach(service => {
      this.services.set(service.id, service);
    });
    this.currentServiceId = sampleServices.length + 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      balance: 0,
      isAdmin: false,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Service category operations
  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const newCategory: ServiceCategory = {
      ...category,
      id: this.currentCategoryId++,
    };
    this.serviceCategories.set(newCategory.id, newCategory);
    return newCategory;
  }

  // Service operations
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.isActive);
  }

  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.categoryId === categoryId && service.isActive);
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(service: InsertService): Promise<Service> {
    const newService: Service = {
      ...service,
      id: this.currentServiceId++,
      isActive: true,
    };
    this.services.set(newService.id, newService);
    return newService;
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      id: this.currentOrderId++,
      userId: 1, // Will be set properly when auth is implemented
      status: "pending",
      startCount: null,
      remainingCount: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.orders.set(order.id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updatedOrder = { 
      ...order, 
      status,
      completedAt: status === "completed" ? new Date() : order.completedAt 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
