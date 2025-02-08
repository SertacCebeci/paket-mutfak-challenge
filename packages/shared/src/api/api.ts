const BASE_URL = 'http://localhost:4000';

import {
  BasketEntity,
  CourierEntity,
  OrderEntity,
  OrderStatus,
} from '../types';

export class API {
  // Orders
  static async getOrders(): Promise<OrderEntity[]> {
    const response = await fetch(`${BASE_URL}/orders`);
    return response.json();
  }

  static async getOrder(id: string): Promise<OrderEntity> {
    const response = await fetch(`${BASE_URL}/orders/${id}`);
    return response.json();
  }

  static async createOrder(
    order: Omit<OrderEntity, 'id'>,
  ): Promise<OrderEntity> {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return response.json();
  }

  static async updateOrder(
    id: string,
    order: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return response.json();
  }

  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderEntity> {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  static async updateOrderBasket(
    id: string,
    basket_id: string | null,
  ): Promise<OrderEntity> {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ basket_id }),
    });
    return response.json();
  }

  static async deleteOrder(id: string): Promise<void> {
    await fetch(`${BASE_URL}/orders/${id}`, { method: 'DELETE' });
  }

  // Couriers
  static async getCouriers(): Promise<CourierEntity[]> {
    const response = await fetch(`${BASE_URL}/couriers`);
    return response.json();
  }

  static async getCourier(id: string): Promise<CourierEntity> {
    const response = await fetch(`${BASE_URL}/couriers/${id}`);
    return response.json();
  }

  static async getAvailableCouriers(): Promise<CourierEntity[]> {
    const response = await fetch(`${BASE_URL}/couriers?basket_id=null`);
    return response.json();
  }

  // Baskets
  static async getBaskets(): Promise<BasketEntity[]> {
    const response = await fetch(`${BASE_URL}/baskets`);
    return response.json();
  }

  static async getBasket(id: string): Promise<BasketEntity> {
    const response = await fetch(`${BASE_URL}/baskets/${id}`);
    return response.json();
  }

  static async createBasket(
    basket: Omit<BasketEntity, 'id'>,
  ): Promise<BasketEntity> {
    const response = await fetch(`${BASE_URL}/baskets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basket),
    });
    return response.json();
  }

  static async updateBasket(
    id: string,
    basket: Partial<BasketEntity>,
  ): Promise<BasketEntity> {
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

  static async addOrderToBasket(
    basket_id: string,
    order_id: string,
  ): Promise<BasketEntity> {
    const basket = await API.getBasket(basket_id);
    basket.orders.push(order_id);
    return API.updateBasket(basket_id, { orders: basket.orders });
  }

  static async removeOrderFromBasket(
    basket_id: string,
    order_id: string,
  ): Promise<BasketEntity> {
    const basket = await API.getBasket(basket_id);
    basket.orders = basket.orders.filter((id) => id !== order_id);
    return API.updateBasket(basket_id, { orders: basket.orders });
  }

  static async assignCourierToBasket(
    basketId: string,
    courierId: string,
  ): Promise<{ basket: BasketEntity; courier: CourierEntity }> {
    const [basketResponse, courierResponse] = await Promise.all([
      fetch(`${BASE_URL}/baskets/${basketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier_id: courierId }),
      }),
      fetch(`${BASE_URL}/couriers/${courierId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basket_id: basketId }),
      }),
    ]);

    const [basket, courier] = await Promise.all([
      basketResponse.json(),
      courierResponse.json(),
    ]);

    return { basket, courier };
  }

  static async removeCourierFromBasket(
    basketId: string,
    courierId: string,
  ): Promise<{ basket: BasketEntity; courier: CourierEntity }> {
    const [basketResponse, courierResponse] = await Promise.all([
      fetch(`${BASE_URL}/baskets/${basketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier_id: null }),
      }),
      fetch(`${BASE_URL}/couriers/${courierId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basket_id: null }),
      }),
    ]);

    const [basket, courier] = await Promise.all([
      basketResponse.json(),
      courierResponse.json(),
    ]);

    return { basket, courier };
  }

  static async markBasketAsDelivered(basketId: string): Promise<void> {
    const basket = await API.getBasket(basketId);
    if (!basket.courier_id) return;

    const currentCourierId = basket.courier_id;
    // I need a way to make these transactional
    // this needs to be one function call from the backend server in prod

    const results = await Promise.all([
      // Update basket status and courier information
      fetch(`${BASE_URL}/baskets/${basketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'delivered',
          courier_id: null,
          delivered_by: currentCourierId,
        }),
      }),
      // Clear courier's basket_id
      fetch(`${BASE_URL}/couriers/${currentCourierId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basket_id: null }),
      }),
      // Mark all orders as delivered
      ...basket.orders.map((orderId) =>
        fetch(`${BASE_URL}/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'delivered' }),
        }),
      ),
    ]);

    // Ensure all requests were successful
    await Promise.all(results.map((r) => r.json()));
  }
}
