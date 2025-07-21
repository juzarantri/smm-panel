import { db } from "./db";
import { serviceCategories, services } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingCategories = await db.select().from(serviceCategories);
    if (existingCategories.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // Insert service categories
    const sampleCategories = [
      { name: "Instagram", slug: "instagram", icon: "fab fa-instagram", color: "from-pink-500 to-purple-600", description: "Followers, Likes, Views, Comments, Stories", orderIndex: 1 },
      { name: "YouTube", slug: "youtube", icon: "fab fa-youtube", color: "from-red-500 to-red-600", description: "Views, Subscribers, Likes, Watch Time", orderIndex: 2 },
      { name: "TikTok", slug: "tiktok", icon: "fab fa-tiktok", color: "from-black to-gray-800", description: "Followers, Likes, Views, Shares", orderIndex: 3 },
      { name: "Facebook", slug: "facebook", icon: "fab fa-facebook", color: "from-blue-600 to-blue-700", description: "Page Likes, Post Likes, Followers", orderIndex: 4 },
      { name: "Twitter", slug: "twitter", icon: "fab fa-twitter", color: "from-blue-400 to-blue-600", description: "Followers, Likes, Retweets, Views", orderIndex: 5 },
      { name: "Spotify", slug: "spotify", icon: "fab fa-spotify", color: "from-green-500 to-green-600", description: "Plays, Followers, Monthly Listeners", orderIndex: 6 },
      { name: "LinkedIn", slug: "linkedin", icon: "fab fa-linkedin", color: "from-blue-600 to-indigo-700", description: "Connections, Post Likes, Followers", orderIndex: 7 },
      { name: "Others", slug: "others", icon: "fas fa-ellipsis-h", color: "from-gray-600 to-gray-800", description: "Discord, Telegram, Reddit & More", orderIndex: 8 },
    ];

    const insertedCategories = await db.insert(serviceCategories).values(sampleCategories).returning();
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Insert sample services
    const sampleServices = [
      { categoryId: insertedCategories[0].id, name: "Instagram Followers - Real & Active", description: "High-quality followers from real accounts", price: 1250, minQuantity: 100, maxQuantity: 50000, isActive: true, deliveryTime: "1-24 hours", features: ["Real accounts", "No drop guarantee", "Fast delivery"] },
      { categoryId: insertedCategories[0].id, name: "Instagram Likes - Instant", description: "Get instant likes on your posts", price: 50, minQuantity: 50, maxQuantity: 10000, isActive: true, deliveryTime: "0-1 hours", features: ["Instant start", "High retention", "Safe"] },
      { categoryId: insertedCategories[1].id, name: "YouTube Views - High Retention", description: "Quality views with high retention rate", price: 200, minQuantity: 1000, maxQuantity: 100000, isActive: true, deliveryTime: "2-6 hours", features: ["High retention", "Safe for monetization", "Gradual delivery"] },
      { categoryId: insertedCategories[1].id, name: "YouTube Subscribers - Permanent", description: "Permanent subscribers that won't drop", price: 2500, minQuantity: 50, maxQuantity: 5000, isActive: true, deliveryTime: "1-3 days", features: ["Permanent", "Real accounts", "No drop"] },
      { categoryId: insertedCategories[2].id, name: "TikTok Followers - High Quality", description: "Premium TikTok followers from active accounts", price: 800, minQuantity: 100, maxQuantity: 20000, isActive: true, deliveryTime: "1-12 hours", features: ["Real profiles", "Fast start", "No drop"] },
      { categoryId: insertedCategories[2].id, name: "TikTok Likes - Fast Delivery", description: "Get more likes on your TikTok videos", price: 30, minQuantity: 100, maxQuantity: 50000, isActive: true, deliveryTime: "0-2 hours", features: ["Instant start", "Safe delivery", "High quality"] },
    ];

    const insertedServices = await db.insert(services).values(sampleServices).returning();
    console.log(`Inserted ${insertedServices.length} services`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}