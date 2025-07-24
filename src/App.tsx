import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Products from './components/pages/Products';
import AddProduct from './components/pages/AddProduct';
import AddStock from './components/pages/AddStock';
import Sales from './components/pages/Sales';
import MakeSale from './components/pages/MakeSale';
import Reports from './components/pages/Reports';
import Categories from './components/pages/Categories';
import StockEntriesTable from './components/stock/StockEntriesTable';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'add-product':
        return user.role === 'admin' ? <AddProduct /> : <Dashboard />;
      case 'add-stock':
        return user.role === 'admin' ? <AddStock /> : <Dashboard />;
      case 'sales':
        return <Sales />;
      case 'make-sale':
        return user.role === 'sales' ? <MakeSale /> : <Dashboard />;
      case 'reports':
        return user.role === 'admin' ? <Reports /> : <Dashboard />;
      case 'categories':
        return user.role === 'admin' ? <Categories /> : <Dashboard />;
      case 'stock-history':
        return user.role === 'admin' ? <StockEntriesTable /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
