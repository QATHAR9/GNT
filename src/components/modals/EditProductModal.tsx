import React, { useState } from 'react';
import { Product } from '../../types';
import { useData } from '../../contexts/DataContext';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose }) => {
  const { updateProduct } = useData();
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    sku: product.sku,
    buyingPrice: product.buyingPrice.toString(),
    sellingPrice: product.sellingPrice.toString(),
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProduct({
        ...product,
        ...formData,
        buyingPrice: parseFloat(formData.buyingPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
      });
      onClose();
    } catch (err) {
      alert('Failed to update product. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-white text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Product Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">SKU</label>
            <input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Buying Price (KES)</label>
              <input
                name="buyingPrice"
                type="number"
                min="0"
                value={formData.buyingPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Selling Price (KES)</label>
              <input
                name="sellingPrice"
                type="number"
                min="0"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
