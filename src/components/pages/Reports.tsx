import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BarChart3, TrendingUp, DollarSign, Calendar, Download, Filter } from 'lucide-react';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { sales, products, exportToExcel } = useData();
  const [dateFilter, setDateFilter] = useState('month');
  const [reportType, setReportType] = useState('overview');

  // Calculate date ranges
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Filter sales based on date
  const getFilteredSales = () => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      switch (dateFilter) {
        case 'today':
          return saleDate.toDateString() === today.toDateString();
        case 'yesterday':
          return saleDate.toDateString() === yesterday.toDateString();
        case 'week':
          return saleDate >= lastWeek;
        case 'month':
          return saleDate >= lastMonth;
        default:
          return true;
      }
    });
  };

  const filteredSales = getFilteredSales();

  // Calculate metrics
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => {
    const product = products.find(p => p.id === sale.productId);
    return product ? sum + ((sale.sellingPrice - product.buyingPrice) * sale.quantity) : sum;
  }, 0);
  const totalItemsSold = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  const averageOrderValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Top selling products
  const productSales = filteredSales.reduce((acc, sale) => {
    const existing = acc.find(item => item.productId === sale.productId);
    if (existing) {
      existing.quantity += sale.quantity;
      existing.revenue += sale.total;
    } else {
      acc.push({
        productId: sale.productId,
        productName: sale.productName,
        quantity: sale.quantity,
        revenue: sale.total
      });
    }
    return acc;
  }, [] as any[]);

  const topProducts = productSales
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Category performance
  const categoryPerformance = filteredSales.reduce((acc, sale) => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      const existing = acc.find(item => item.category === product.category);
      if (existing) {
        existing.revenue += sale.total;
        existing.quantity += sale.quantity;
      } else {
        acc.push({
          category: product.category,
          revenue: sale.total,
          quantity: sale.quantity
        });
      }
    }
    return acc;
  }, [] as any[]);

  const topCategories = categoryPerformance
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    change?: string;
  }> = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-400 mt-1">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-white">Business Reports</h2>
          </div>
          <button
            onClick={() => exportToExcel('reports')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">Report Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Period
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="overview">Business Overview</option>
              <option value="products">Product Performance</option>
              <option value="categories">Category Analysis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`KES ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-600"
        />
        <MetricCard
          title="Total Profit"
          value={`KES ${totalProfit.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-purple-600"
        />
        <MetricCard
          title="Items Sold"
          value={totalItemsSold}
          icon={BarChart3}
          color="bg-blue-600"
        />
        <MetricCard
          title="Avg Order Value"
          value={`KES ${averageOrderValue.toLocaleString()}`}
          icon={Calendar}
          color="bg-indigo-600"
        />
        <MetricCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={TrendingUp}
          color="bg-orange-600"
        />
      </div>

      {/* Report Content */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Summary */}
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sales Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-300">Total Transactions</span>
                <span className="text-white font-semibold">{filteredSales.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-300">Revenue</span>
                <span className="text-green-400 font-semibold">KES {totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-300">Profit</span>
                <span className="text-purple-400 font-semibold">KES {totalProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-300">Profit Margin</span>
                <span className="text-orange-400 font-semibold">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Inventory Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-300">Total Products</span>
                <span className="text-white font-semibold">{products.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-300">Total Stock</span>
                <span className="text-blue-400 font-semibold">
                  {products.reduce((sum, p) => sum + p.stock, 0)} units
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-300">Low Stock Items</span>
                <span className="text-red-400 font-semibold">
                  {products.filter(p => p.stock < 5).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-300">Inventory Value</span>
                <span className="text-yellow-400 font-semibold">
                  KES {products.reduce((sum, p) => sum + (p.buyingPrice * p.stock), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'products' && (
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Quantity Sold</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Revenue (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topProducts.map((product, index) => (
                  <tr key={product.productId}>
                    <td className="px-4 py-3 text-white">{product.productName}</td>
                    <td className="px-4 py-3 text-gray-300">{product.quantity}</td>
                    <td className="px-4 py-3 text-green-400 font-semibold">
                      KES {product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'categories' && (
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Items Sold</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Revenue (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topCategories.map((category, index) => (
                  <tr key={category.category}>
                    <td className="px-4 py-3 text-white">{category.category}</td>
                    <td className="px-4 py-3 text-gray-300">{category.quantity}</td>
                    <td className="px-4 py-3 text-green-400 font-semibold">
                      KES {category.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;