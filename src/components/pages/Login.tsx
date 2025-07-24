import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Store, User, Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin' as 'admin' | 'sales'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = login(formData.username, formData.password, formData.role);
    
    if (!success) {
      setError('Invalid credentials. Please check your username, password, and role.');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (role: 'admin' | 'sales') => {
    setFormData({
      username: role,
      password: role === 'admin' ? 'admin123' : 'sales123',
      role
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Store className="h-16 w-16 text-orange-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Gents by Elegante</h2>
          <p className="mt-2 text-sm text-gray-400">Men's Fashion Store Management</p>
        </div>

        {/* Login Form */}
        <div className="bg-black rounded-xl shadow-xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.role === 'admin'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <User className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">Admin</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'sales' }))}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.role === 'sales'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <User className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">Sales Staff</div>
                </button>
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 text-center mb-4">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="p-3 bg-gray-800 rounded-lg text-center hover:bg-gray-700 transition-colors"
              >
                <div className="text-sm font-medium text-orange-400">Admin Demo</div>
                <div className="text-xs text-gray-400 mt-1">admin / admin123</div>
              </button>
              <button
                onClick={() => handleDemoLogin('sales')}
                className="p-3 bg-gray-800 rounded-lg text-center hover:bg-gray-700 transition-colors"
              >
                <div className="text-sm font-medium text-blue-400">Sales Demo</div>
                <div className="text-xs text-gray-400 mt-1">sales / sales123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;