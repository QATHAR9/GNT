import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  buying_price: number;
};

type Sale = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total: number;
  date: string;
  sold_by: string;
  sold_by_id: string;
  selling_price: number;
};

type StockEntry = {
  id: string;
  product_name: string;
  quantity: number;
  date: string;
  added_by: string;
};

type DataContextType = {
  products: Product[];
  sales: Sale[];
  stockEntries: StockEntry[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => Promise<void>;
  addStockEntry: (entry: Omit<StockEntry, 'id' | 'date'>) => Promise<void>;
  addStock: (productId: string, quantity: number, addedBy: string) => Promise<void>; // ✅ NEW
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);

  // Load data from Supabase
  useEffect(() => {
    fetchProducts();
    fetchSales();
    fetchStockEntries();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) {
      setProducts(data);
    } else {
      console.error('Error loading products:', error);
    }
  };

  const fetchSales = async () => {
    const { data, error } = await supabase.from('sales').select('*');
    if (!error && data) {
      setSales(data);
    } else {
      console.error('Error loading sales:', error);
    }
  };

  const fetchStockEntries = async () => {
    const { data, error } = await supabase.from('stock_entries').select('*');
    if (!error && data) {
      setStockEntries(data);
    } else {
      console.error('Error loading stock entries:', error);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { error } = await supabase.from('products').insert(product);
    if (!error) fetchProducts();
    else console.error('Error adding product:', error);
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'date'>) => {
    const { error } = await supabase.from('sales').insert({
      ...sale,
      date: new Date().toISOString()
    });
    if (!error) fetchSales();
    else console.error('Error adding sale:', error);
  };

  const addStockEntry = async (entry: Omit<StockEntry, 'id' | 'date'>) => {
    const { error } = await supabase.from('stock_entries').insert({
      ...entry,
      date: new Date().toISOString()
    });
    if (!error) fetchStockEntries();
    else console.error('Error adding stock entry:', error);
  };

  // ✅ New unified function
  const addStock = async (productId: string, quantity: number, addedBy: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');

    // 1. Add stock entry
    const { error: entryError } = await supabase.from('stock_entries').insert({
      product_name: product.name,
      quantity,
      added_by: addedBy,
      date: new Date().toISOString()
    });
    if (entryError) throw entryError;

    // 2. Update product stock
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: product.stock + quantity })
      .eq('id', productId);
    if (updateError) throw updateError;

    // 3. Refresh state
    await fetchProducts();
    await fetchStockEntries();
  };

  return (
    <DataContext.Provider
      value={{
        products,
        sales,
        stockEntries,
        addProduct,
        addSale,
        addStockEntry,
        addStock
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
