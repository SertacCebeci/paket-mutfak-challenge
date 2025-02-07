const BASE_URL = 'http://localhost:4000';

export interface Order {
  id: string;
  address: string;
  payment: string;
  delivery_time: string;
  status: string;
  items: Array<{ id: string; name: string }>;
}

export interface Courier {
  id: string;
  name: string;
}

export interface Basket {
  id: string;
  courier_id: string;
  status: string;
  orders: number[];
}

export class API {
  // Orders
  static async getOrders(): Promise<Order[]> {
    const response = await fetch(`${BASE_URL}/orders`);
    return response.json();
  }

  static async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${BASE_URL}/orders/${id}`);
    return response.json();
  }

  static async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return response.json();
  }

  static async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return response.json();
  }

  static async deleteOrder(id: string): Promise<void> {
    await fetch(`${BASE_URL}/orders/${id}`, { method: 'DELETE' });
  }

  // Couriers
  static async getCouriers(): Promise<Courier[]> {
    const response = await fetch(`${BASE_URL}/couriers`);
    return response.json();
  }

  static async getCourier(id: string): Promise<Courier> {
    const response = await fetch(`${BASE_URL}/couriers/${id}`);
    return response.json();
  }

  // Baskets
  static async getBaskets(): Promise<Basket[]> {
    const response = await fetch(`${BASE_URL}/baskets`);
    return response.json();
  }

  static async getBasket(id: string): Promise<Basket> {
    const response = await fetch(`${BASE_URL}/baskets/${id}`);
    return response.json();
  }

  static async createBasket(basket: Omit<Basket, 'id'>): Promise<Basket> {
    const response = await fetch(`${BASE_URL}/baskets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basket),
    });
    return response.json();
  }

  static async updateBasket(id: string, basket: Partial<Basket>): Promise<Basket> {
    const response = await fetch(`${BASE_URL}/baskets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basket),
    });
    return response.json();
  }

  static async deleteBasket(id: string): Promise<void> {
    await fetch(`${BASE_URL}/baskets/${id}`, { method: 'DELETE' });
  }
}
