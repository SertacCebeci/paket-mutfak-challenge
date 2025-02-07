import { atom } from 'jotai';

// preparing orders will be on preparing column
// not_basket_prepared and in_basket_prepared orders will be on pending column
// on_the_way orders will be on on_the_way column
export type OrderStatus = 'preparing' | 'not_basket_prepared' | 'in_basket_prepared' | 'on_the_way' | 'delivered';

// waiting_order and prepared baskets will be on pending column
// on_the_way baskets will be on on_the_way column
export type BasketStatus = 'waiting_order' | 'prepared' | 'on_the_way' | 'delivered';

export interface Courier {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  address: string;
  payment: string;
  delivery_time: string;
  status: OrderStatus;
  items: { id: string; name: string }[];
}

export interface Basket {
  id: string;
  status: BasketStatus;
  courier_id: string | null;
  orders: string[];
}

const courierAtom = atom<Courier[]>([
  { id: '1', name: 'Cemrehan Çavdar' },
  { id: '2', name: 'Yasin Beyazlı' },
  { id: '3', name: 'Duhan Günsel' },
]);

const orderAtom = atom<Order[]>([
  {
    id: '1',
    address: 'Kadıköy, İstanbul, Turkey, Sahte Sokak, No: 123 Daire: 4',
    payment: 'Credit Card',
    delivery_time: '2024-12-24T23:59:59Z',
    status: 'on_the_way',
    items: [
      { id: '1', name: 'Şerifali Köfte' },
      { id: '2', name: 'Mercimek Çorbası' },
    ],
  },
  {
    id: '2',
    address: 'Bağdat Caddesi, Bağdat Sokak, No: 1, Daire: 1, Kadıköy, İstanbul',
    payment: 'Cash',
    delivery_time: '2024-12-25T12:00:00Z',
    status: 'on_the_way',
    items: [
      { id: '3', name: 'Adana Kebap' },
      { id: '4', name: 'Baklava' },
    ],
  },
  {
    id: '3',
    address: 'Kadıköy, İstanbul, Turkey,  Başka bir Sok, No: 456 Bina: 7 Daire: 8 Bina Adı: Uzun Apartmanı',
    payment: 'Credit Card',
    status: 'preparing',
    delivery_time: '2024-12-26T23:59:59Z',
    items: [
      { id: '5', name: 'Tavuklu Salata' },
      { id: '6', name: 'Ayran' },
    ],
  },
]);

const basketAtom = atom<Basket[]>([
  {
    id: '1',
    courier_id: '1',
    status: 'on_the_way',
    orders: ['1', '2'],
  },
]);

export { orderAtom, basketAtom, courierAtom };
