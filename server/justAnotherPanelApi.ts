// Using global fetch (available in Node.js 18+)

interface JustAnotherPanelOrder {
  service: number;
  link: string;
  quantity?: number;
  runs?: number;
  interval?: number;
  keywords?: string;
  comments?: string;
  usernames?: string;
  hashtags?: string;
  hashtag?: string;
  username?: string;
  media?: string;
  country?: string;
  device?: string;
  type_of_traffic?: number;
  google_keyword?: string;
  min?: number;
  max?: number;
  posts?: number;
  old_posts?: number;
  delay?: number;
  expiry?: string;
  answer_number?: string;
  groups?: string;
}

interface JustAnotherPanelResponse {
  order?: number;
  error?: string;
  charge?: number;
  start_count?: number;
  status?: string;
  remains?: number;
  currency?: string;
}

interface JustAnotherPanelService {
  service: number;
  name: string;
  type: string;
  rate: string;
  min: string;
  max: string;
  category: string;
  description?: string;
  refill?: boolean;
  cancel?: boolean;
}

export class JustAnotherPanelApi {
  private apiUrl = 'https://justanotherpanel.com/api/v2';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.JUSTANOTHERPANEL_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('JUSTANOTHERPANEL_API_KEY environment variable is required');
    }
  }

  private async makeRequest(params: Record<string, any>): Promise<any> {
    const postData = new URLSearchParams({
      key: this.apiKey,
      ...params
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
        },
        body: postData.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('JustAnotherPanel API request failed:', error);
      throw error;
    }
  }

  /** Add order */
  async order(data: JustAnotherPanelOrder): Promise<JustAnotherPanelResponse> {
    return await this.makeRequest({ action: 'add', ...data });
  }

  /** Get order status */
  async status(orderId: number): Promise<JustAnotherPanelResponse> {
    return await this.makeRequest({
      action: 'status',
      order: orderId
    });
  }

  /** Get orders status */
  async multiStatus(orderIds: number[]): Promise<JustAnotherPanelResponse[]> {
    return await this.makeRequest({
      action: 'status',
      orders: orderIds.join(',')
    });
  }

  /** Get services */
  async services(): Promise<JustAnotherPanelService[]> {
    return await this.makeRequest({
      action: 'services'
    });
  }

  /** Refill order */
  async refill(orderId: number): Promise<JustAnotherPanelResponse> {
    return await this.makeRequest({
      action: 'refill',
      order: orderId
    });
  }

  /** Refill orders */
  async multiRefill(orderIds: number[]): Promise<JustAnotherPanelResponse[]> {
    return await this.makeRequest({
      action: 'refill',
      orders: orderIds.join(',')
    });
  }

  /** Get refill status */
  async refillStatus(refillId: number): Promise<JustAnotherPanelResponse> {
    return await this.makeRequest({
      action: 'refill_status',
      refill: refillId
    });
  }

  /** Get refill statuses */
  async multiRefillStatus(refillIds: number[]): Promise<JustAnotherPanelResponse[]> {
    return await this.makeRequest({
      action: 'refill_status',
      refills: refillIds.join(',')
    });
  }

  /** Cancel orders */
  async cancel(orderIds: number[]): Promise<JustAnotherPanelResponse[]> {
    return await this.makeRequest({
      action: 'cancel',
      orders: orderIds.join(',')
    });
  }

  /** Get balance */
  async balance(): Promise<{ balance: string; currency: string }> {
    return await this.makeRequest({
      action: 'balance'
    });
  }
}

export const justAnotherPanelApi = new JustAnotherPanelApi();