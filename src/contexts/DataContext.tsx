import React, { createContext, useContext, useState, useEffect } from 'react';

// Replace these with actual type imports if available
type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  buyingPrice: number;
};

type Sale = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  date: string;
  soldBy: string;
  soldById: string;
  sellingPrice: number;
};

type StockEntry = {
  id: string;
  productName: string;
  quantity: number;
  date: string;
  addedBy: string;
};

const DataContext = createContext<{
  products: Product[];
  sales: Sale[];
  stockEntries: StockEntry[];
} | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);

  useEffect(() => {
    // Optional: Load from API or use hardcoded test data
    setProducts([]);
    setSales([]);
    setStockEntries([]);
  }, []);

  return (
    <DataContext.Provider value={{ products, sales, stockEntries }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
