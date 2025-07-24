import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Tags, Plus, Trash2, Edit3 } from 'lucide-react';

const Categories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useData();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsAdding(true);
    try {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" category?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Tags className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-white">Manage Categories</h2>
        </div>
        <p className="text-gray-400 mt-2">Organize your products by creating and managing categories</p>
      </div>

      {/* Add Category Form */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !newCategoryName.trim()}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isAdding ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="h-5 w-5 mr-2" />
            )}
            Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">All Categories</h3>
          <p className="text-sm text-gray-400 mt-1">{categories.length} categories total</p>
        </div>

        {categories.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {categories.map((category) => (
              <div key={category.id} className="p-6 hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Tags className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">{category.name}</h4>
                      <p className="text-sm text-gray-400">
                        Created {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Tags className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No Categories Yet</h3>
            <p className="text-gray-500">Create your first category to organize your products</p>
          </div>
        )}
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Total Categories</p>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
            <Tags className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Most Recent</p>
              <p className="text-lg font-bold text-white">
                {categories.length > 0 
                  ? categories[categories.length - 1].name 
                  : 'None'
                }
              </p>
            </div>
            <Plus className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Created Today</p>
              <p className="text-2xl font-bold text-white">
                {categories.filter(cat => 
                  new Date(cat.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <Edit3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;