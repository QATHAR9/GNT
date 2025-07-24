import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ShoppingCart, Calendar, User, DollarSign, Filter, Download } from 'lucide-react';

const Sales: React.FC = () => {
  const { user } = useAuth();
  const { sales, products, exportToExcel } = useData();
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter sales based on user role
  const userSales = user?.role === 'admin' 
    ? sales 
    : sales.filter(sale => sale.soldById === user?.id);

  // Apply filters
  const filteredSales = userSales.filter(sale => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    let dateMatch = true;
    switch (dateFilter) {
      case 'today':
        dateMatch = saleDate.toDateString() === today.toDateString();
        break;
      case 'yesterday':
        dateMatch = saleDate.toDateString() === yesterday.toDateString();
        break;
      case 'week':
        dateMatch = saleDate >= lastWeek;
        break;
      case 'month':
        dateMatch = saleDate >= lastMonth;
        break;
      default:
        dateMatch = true;
    }

    const searchMatch = searchTerm === '' ||
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.soldBy.toLowerCase().includes(searchTerm.toLowerCase());

    return dateMatch && searchMatch;
  });

  // Calculate totals
  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalProfit = user?.role === 'admin' 
    ? filteredSales.reduce((sum, sale) => {
        const product = products.find(p => p.id === sale.productId);
        if (product) {
          return sum + ((sale.sellingPrice - product.buyingPrice) * sale.quantity);
        }
        return sum;
      }, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Total Sales</p>
              <p className="text-2xl font-bold text-white">KES {totalAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Items Sold</p>
              <p className="text-2xl font-bold text-white">{totalQuantity}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Total Profit</p>
                <p className="text-2xl font-bold text-white">KES {totalProfit.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Sales
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product or staff name..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-white">
                {user?.role === 'admin' ? 'All Sales' : 'My Sales'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <button
                  onClick={() => exportToExcel('sales')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Sales
                </button>
              )}
              <div className="text-sm text-gray-400">
                {filteredSales.length} sales found
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price (KES)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total (KES)
                </th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sold By
                  </th>
                )}
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Profit (KES)
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredSales.map((sale) => {
                const saleProfit = user?.role === 'admin' 
                  ? (() => {
                      const product = products.find(p => p.id === sale.productId);
                      return product ? (sale.sellingPrice - product.buyingPrice) * sale.quantity : 0;
                    })()
                  : 0;

                return (
                  <tr key={sale.id} className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">
                          {new Date(sale.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(sale.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {sale.productName}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {sale.quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      KES {sale.sellingPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-green-400 font-semibold">
                      KES {sale.total.toLocaleString()}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{sale.soldBy}</span>
                        </div>
                      </td>
                    )}
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 text-purple-400 font-semibold">
                        KES {saleProfit.toLocaleString()}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredSales.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No sales found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;