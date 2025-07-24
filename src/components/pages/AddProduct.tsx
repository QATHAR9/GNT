import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Package, Plus, DollarSign } from 'lucide-react';

const AddProduct: React.FC = () => {
  const { categories, addProduct } = useData();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    buyingPrice: '',
    sellingPrice: '',
    stock: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      addProduct({
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        buyingPrice: parseFloat(formData.buyingPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        stock: parseInt(formData.stock)
      });

      setSuccess(true);
      setFormData({
        name: '',
        category: '',
        sku: '',
        buyingPrice: '',
        sellingPrice: '',
        stock: ''
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const profitMargin = formData.buyingPrice && formData.sellingPrice 
    ? ((parseFloat(formData.sellingPrice) - parseFloat(formData.buyingPrice)) / parseFloat(formData.buyingPrice) * 100).toFixed(1)
    : '0';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Plus className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-white">Add New Product</h2>
        </div>
        <p className="text-gray-400 mt-2">Add a new product to your inventory</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 px-6 py-4 rounded-xl">
          Product added successfully!
        </div>
      )}

      {/* Add Product Form */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category and SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., SH-001"
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buying Price (KES) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">KES</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.buyingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, buyingPrice: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selling Price (KES) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">KES</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Profit Margin Display */}
          {formData.buyingPrice && formData.sellingPrice && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Profit Margin:</span>
                <span className={`font-semibold ${
                  parseFloat(profitMargin) > 50 ? 'text-green-400' :
                  parseFloat(profitMargin) > 25 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {profitMargin}%
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-300">Profit per Item:</span>
                <span className="text-green-400 font-semibold">
                  KES {(parseFloat(formData.sellingPrice) - parseFloat(formData.buyingPrice)).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Initial Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Initial Stock *
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter initial stock quantity"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                category: '',
                sku: '',
                buyingPrice: '',
                sellingPrice: '',
                stock: ''
              })}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="h-5 w-5 mr-2" />
              )}
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;