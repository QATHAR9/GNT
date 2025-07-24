import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { TrendingUp, Package, Plus } from 'lucide-react';

const AddStock: React.FC = () => {
  const { user } = useAuth();
  const { products, addStock } = useData();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      addStock(formData.productId, parseInt(formData.quantity), user.name);
      setSuccess(true);
      setFormData({ productId: '', quantity: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-white">Add Stock</h2>
        </div>
        <p className="text-gray-400 mt-2">Increase inventory for existing products</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 px-6 py-4 rounded-xl">
          Stock added successfully!
        </div>
      )}

      {/* Add Stock Form */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Product *
            </label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Choose a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.category} (Current: {product.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Current Stock Display */}
          {selectedProduct && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Product Name</p>
                  <p className="text-white font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Stock</p>
                  <p className={`font-semibold ${
                    selectedProduct.stock < 5 ? 'text-red-400' :
                    selectedProduct.stock < 10 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {selectedProduct.stock} units
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-gray-300">{selectedProduct.category}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quantity to Add */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity to Add *
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter quantity to add"
                required
              />
            </div>
          </div>

          {/* New Stock Preview */}
          {selectedProduct && formData.quantity && (
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-300">New Stock Level:</span>
                <span className="text-blue-400 font-bold text-lg">
                  {selectedProduct.stock + parseInt(formData.quantity)} units
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-blue-300">Stock Increase:</span>
                <span className="text-green-400 font-semibold">
                  +{formData.quantity} units
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({ productId: '', quantity: '' })}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.productId || !formData.quantity}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="h-5 w-5 mr-2" />
              )}
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStock;