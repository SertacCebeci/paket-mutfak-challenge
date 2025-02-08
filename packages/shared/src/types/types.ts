export type OrderStatus = 'preparing' | 'prepared' | 'on_the_way' | 'delivered';
export type BasketStatus = 'prepared' | 'on_the_way' | 'delivered';

interface Restaurant {
  id: string;
  name: string;
  location: string;
}

interface OrderItem {
  id: string;
  name: string;
  preparation_time: number;
}

export interface OrderEntity {
  id: string;
  address: string;
  payment: string;
  delivery_time: string;
  order_time: string;
  preparation_time: number;
  restaurant: Restaurant;
  status: OrderStatus;
  basket_id: string | null;

  items: OrderItem[];
}
export interface CourierEntity {
  id: string;
  name: string;
  basket_id: string | null;
}

export interface BasketEntity {
  id: string;
  courier_id: string | null;
  delivered_by: string | null;
  status: BasketStatus;
  orders: string[];
}
