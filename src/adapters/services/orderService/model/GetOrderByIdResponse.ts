export interface GetOrderByIdResponse {
  id: string;
  number: string;
  user: User;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  combos: Combo[];
}

interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  annotation: string;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface User {
  id: string;
  name: string;
}
