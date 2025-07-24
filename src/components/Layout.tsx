import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Tags,
  Plus,
  TrendingUp,
  LogOut,
  User,
  Store,
  Table, // ✅ Added for Stock History
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: Plus },
    { id: 'add-stock', label: 'Add Stock', icon: TrendingUp },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'stock-history', label: 'Stock History', icon: Table }, 
  ];

  const salesNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'make-sale', label: 'Make Sale', icon: ShoppingCart },
    { id: 'sales', label: 'My Sales', icon: BarChart3 },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : salesNavItems;

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-gray-800">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-xl font-bold text-white">Gents by Elegante</h1>
              <p className="text-sm text-gray-400">Men's Fashion</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-orange-600 text-white border-r-4 border-orange-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-black border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white capitalize">
                {currentPage.replace('-', ' ')}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.name}</span>
                <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
                  {user?.role?.toUpperCase()}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
