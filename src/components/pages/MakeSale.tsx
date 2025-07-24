import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ShoppingCart, Package, DollarSign, CheckCircle } from 'lucide-react';

const MakeSale: React.FC = () => {
  const { user } = useAuth();
  const { products, makeSale } = useData();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedProduct = products.find(p => p.id === formData.productId);
  const quantity = parseInt(formData.quantity) || 0;
  const total = selectedProduct ? selectedProduct.sellingPrice * quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProduct) return;

    setIsSubmitting(true);
    setError('');

    try {
      const success = makeSale(formData.productId, quantity, user.name, user.id);
      
      if (success) {
        setSuccess(true);
        setFormData({ productId: '', quantity: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Insufficient stock available for this sale.');
      }
    } catch (error) {
      setError('An error occurred while processing the sale.');
      console.error('Error making sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter products with stock > 0
  const availableProducts = products.filter(p => p.stock > 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <ShoppingCart className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-white">Make a Sale</h2>
        </div>
        <p className="text-gray-400 mt-2">Process a new sale transaction</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 px-6 py-4 rounded-xl flex items-center">
          <CheckCircle className="h-5 w-5 mr-3" />
          Sale completed successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Make Sale Form */}
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
              {availableProducts.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.sellingPrice} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Product Details */}
          {selectedProduct && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Product</p>
                  <p className="text-white font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-400">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-green-400 font-semibold text-lg">
                    KES {selectedProduct.sellingPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Available Stock</p>
                  <p className={`font-semibold ${
                    selectedProduct.stock < 5 ? 'text-red-400' :
                    selectedProduct.stock < 10 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {selectedProduct.stock} units
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity *
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                min="1"
                max={selectedProduct ? selectedProduct.stock : undefined}
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter quantity"
                required
              />
            </div>
            {selectedProduct && quantity > selectedProduct.stock && (
              <p className="text-red-400 text-sm mt-2">
                Quantity exceeds available stock ({selectedProduct.stock} units)
              </p>
            )}
          </div>

          {/* Sale Summary */}
          {selectedProduct && formData.quantity && quantity <= selectedProduct.stock && (
            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500 rounded-lg p-4">
              <h4 className="text-orange-400 font-semibold mb-3">Sale Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Product:</span>
                  <span className="text-white">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Price per unit:</span>
                  <span className="text-white">KES {selectedProduct.sellingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Quantity:</span>
                  <span className="text-white">{quantity}</span>
                </div>
                <div className="border-t border-orange-500/30 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-300 font-semibold">Total Amount:</span>
                    <span className="text-orange-400 font-bold text-xl">
                      KES {total.toLocaleString()}
                    </span>
                  </div>
                </div>
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
              disabled={isSubmitting || !selectedProduct || !formData.quantity || quantity > (selectedProduct?.stock || 0)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <DollarSign className="h-5 w-5 mr-2" />
              )}
              Complete Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeSale;