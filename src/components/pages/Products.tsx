import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Package, Edit, Trash2, AlertTriangle, DollarSign, Download, Upload } from 'lucide-react';

const Products: React.FC = () => {
  const { user } = useAuth();
  const { products, deleteProduct, exportToExcel, importFromExcel } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [importing, setImporting] = useState(false);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];
  
  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const success = await importFromExcel(file);
      if (success) {
        alert('Products imported successfully!');
      } else {
        alert('Failed to import products. Please check the file format.');
      }
    } catch (error) {
      alert('Error importing file. Please try again.');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-white">Products</h2>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportToExcel('products')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                  
                  <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {importing ? 'Importing...' : 'Import'}
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleImport}
                      className="hidden"
                      disabled={importing}
                    />
                  </label>
                </div>
              )}
              <div className="text-sm text-gray-400">
                {filteredProducts.length} of {products.length} products
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Buying Price (KES)
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Selling Price (KES)
                </th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Profit Margin
                  </th>
                )}
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredProducts.map((product) => {
                const profitMargin = user?.role === 'admin' 
                  ? ((product.sellingPrice - product.buyingPrice) / product.buyingPrice * 100).toFixed(1)
                  : 0;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-sm text-gray-400">SKU: {product.sku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          product.stock < 5 ? 'text-red-400' : 
                          product.stock < 10 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {product.stock}
                        </span>
                        {product.stock < 5 && (
                          <AlertTriangle className="ml-2 h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 text-gray-300">
                        KES {product.buyingPrice.toLocaleString()}
                      </td>
                    )}
                    <td className="px-6 py-4 text-white font-medium">
                      KES {product.sellingPrice.toLocaleString()}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                          <span className="text-green-400 font-medium">
                            {profitMargin}%
                          </span>
                        </div>
                      </td>
                    )}
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;