import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Package, TrendingUp, DollarSign, ShoppingCart, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { products, sales, stockEntries } = useData();

  // Calculate statistics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  
  // Today's sales
  const today = new Date().toDateString();
  const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today);
  const dailySalesAmount = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const dailySalesCount = todaySales.length;
  
  // Total profit calculation (for admin)
  const totalProfit = sales.reduce((sum, sale) => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      const profit = (sale.sellingPrice - product.buyingPrice) * sale.quantity;
      return sum + profit;
    }
    return sum;
  }, 0);

  // User-specific sales (for sales staff)
  const userSales = sales.filter(sale => sale.soldById === user?.id);
  const userTotalSales = userSales.reduce((sum, sale) => sum + sale.total, 0);

  // Recent activities
  const recentSales = sales.slice(-5).reverse();
  const recentStockEntries = stockEntries.slice(-5).reverse();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-orange-100 mt-2">
          {user?.role === 'admin' 
            ? 'Here\'s your business overview for today.' 
            : 'Ready to make some sales today?'}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="bg-blue-600"
          subtitle={`${totalStock} items in stock`}
        />
        
        <StatCard
          title="Today's Sales"
          value={`KES ${dailySalesAmount.toLocaleString()}`}
          icon={ShoppingCart}
          color="bg-green-600"
          subtitle={`${dailySalesCount} transactions`}
        />

        {user?.role === 'admin' ? (
          <StatCard
            title="Total Profit"
            value={`KES ${totalProfit.toLocaleString()}`}
            icon={TrendingUp}
            color="bg-purple-600"
            subtitle="All time"
          />
        ) : (
          <StatCard
            title="My Sales"
            value={`KES ${userTotalSales.toLocaleString()}`}
            icon={DollarSign}
            color="bg-indigo-600"
            subtitle={`${userSales.length} total sales`}
          />
        )}

        <StatCard
          title="Low Stock Items"
          value={products.filter(p => p.stock < 5).length}
          icon={Package}
          color="bg-red-600"
          subtitle="Need attention"
        />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Sales</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {recentSales.length > 0 ? recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">{sale.productName}</p>
                  <p className="text-sm text-gray-400">
                    Qty: {sale.quantity} • By: {sale.soldBy}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(sale.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-green-400 font-semibold">
                  KES {sale.total.toLocaleString()}
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-4">No recent sales</p>
            )}
          </div>
        </div>

        {/* Stock Updates (Admin only) */}
        {user?.role === 'admin' && (
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Stock Updates</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {recentStockEntries.length > 0 ? recentStockEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{entry.productName}</p>
                    <p className="text-sm text-gray-400">Added by: {entry.addedBy}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-blue-400 font-semibold">
                    +{entry.quantity}
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-center py-4">No recent stock updates</p>
              )}
            </div>
          </div>
        )}

        {/* Low Stock Alert (Sales Staff) */}
        {user?.role === 'sales' && (
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Low Stock Alert</h3>
              <Package className="h-5 w-5 text-red-400" />
            </div>
            
            <div className="space-y-3">
              {products.filter(p => p.stock < 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-900/20 border border-red-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.category}</p>
                  </div>
                  <div className="text-red-400 font-semibold">
                    {product.stock} left
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;