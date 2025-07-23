import { justAnotherPanelApi } from './justAnotherPanelApi';
import { storage } from './storage';
import { services, serviceCategories } from '@shared/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';

interface ServiceCategoryMapping {
  [key: string]: number; // external category name -> internal category ID
}

export class ServiceSyncManager {
  private categoryMapping: ServiceCategoryMapping = {};

  constructor() {
    // Initialize category mapping based on common SMM service categories
    this.initializeCategoryMapping();
  }

  private initializeCategoryMapping() {
    // This will be populated when we fetch services and map them to our categories
    this.categoryMapping = {
      'Instagram': 1,
      'YouTube': 2,
      'TikTok': 3,
      'Facebook': 4,
      'Twitter': 5,
      'Telegram': 6,
      'LinkedIn': 7,
      'Spotify': 8,
    };
  }

  private mapCategoryName(externalCategory: string): number {
    // Try exact match first
    if (this.categoryMapping[externalCategory]) {
      return this.categoryMapping[externalCategory];
    }

    // Try partial matches for common variations
    const categoryName = externalCategory.toLowerCase();
    
    if (categoryName.includes('instagram')) return 1;
    if (categoryName.includes('youtube')) return 2;
    if (categoryName.includes('tiktok') || categoryName.includes('tik tok')) return 3;
    if (categoryName.includes('facebook')) return 4;
    if (categoryName.includes('twitter') || categoryName.includes('x.com')) return 5;
    if (categoryName.includes('telegram')) return 6;
    if (categoryName.includes('linkedin')) return 7;
    if (categoryName.includes('spotify')) return 8;

    // Default to Instagram if no match found
    return 1;
  }

  private calculatePriceInCents(rate: string, quantity: number = 1000): number {
    // Convert rate (per 1000) to cents
    const rateFloat = parseFloat(rate);
    if (isNaN(rateFloat)) return 0;
    
    // Add a markup (e.g., 20%) to the external rate
    const markup = 1.2;
    const pricePerThousand = rateFloat * markup;
    
    // Convert to cents (assuming rate is in dollars)
    return Math.round(pricePerThousand * 100);
  }

  async syncServicesFromJustAnotherPanel(): Promise<void> {
    try {
      console.log('Starting service synchronization with JustAnotherPanel...');
      
      // Fetch services from JustAnotherPanel
      const externalServices = await justAnotherPanelApi.services();
      
      if (!Array.isArray(externalServices)) {
        console.error('Invalid response from JustAnotherPanel services API');
        return;
      }

      console.log(`Found ${externalServices.length} services from JustAnotherPanel`);

      // Clear existing external services (keep only our seeded services)
      // Note: We'll keep all services and update them instead of deleting

      let syncedCount = 0;
      const batchSize = 10;

      // Process services in batches
      for (let i = 0; i < externalServices.length; i += batchSize) {
        const batch = externalServices.slice(i, i + batchSize);
        
        for (const externalService of batch) {
          try {
            // Map external service to our schema
            const categoryId = this.mapCategoryName(externalService.category);
            const price = this.calculatePriceInCents(externalService.rate);

            // Create service in our database
            await db.insert(services).values({
              categoryId,
              name: externalService.name,
              description: externalService.description || `${externalService.name} - ${externalService.category}`,
              price,
              minQuantity: parseInt(externalService.min) || 1,
              maxQuantity: parseInt(externalService.max) || 100000,
              isActive: true,
              deliveryTime: "1-24 hours", // Default delivery time
              features: [], // Empty features array
              externalId: externalService.service,
              serviceType: externalService.type,
              rate: externalService.rate,
              refillSupported: externalService.refill || false,
              cancelSupported: externalService.cancel || false,
            });

            syncedCount++;
          } catch (error) {
            console.error(`Error syncing service ${externalService.service}:`, error);
          }
        }

        // Add small delay between batches to avoid overwhelming the database
        if (i + batchSize < externalServices.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`Successfully synced ${syncedCount} services from JustAnotherPanel`);
    } catch (error) {
      console.error('Error syncing services from JustAnotherPanel:', error);
      throw error;
    }
  }

  async getProviderBalance(): Promise<{ balance: string; currency: string }> {
    try {
      return await justAnotherPanelApi.balance();
    } catch (error) {
      console.error('Error fetching provider balance:', error);
      throw error;
    }
  }
}

export const serviceSyncManager = new ServiceSyncManager();