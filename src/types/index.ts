export interface User {
  id: string;
  username: string;
  role: 'admin' | 'sales';
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  total: number;
  soldBy: string;
  soldById: string;
  date: string;
}

export interface StockEntry {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  addedBy: string;
  date: string;
}