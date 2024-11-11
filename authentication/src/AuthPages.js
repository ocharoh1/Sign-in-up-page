import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';

const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Replace these URLs with your actual endpoints
  const API_URL = {
    register: ' http://localhost:5000/api/users/register',
    login: 'http://localhost:5000/api/users/login'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Form validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(isLogin ? API_URL.login : API_URL.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage({ type: 'success', text: 'Login successful!' });
        // window.location.href = '/dashboard';  // Uncomment and modify as needed
      } else {
        setMessage({ type: 'success', text: 'Registration successful! Please login.' });
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage({ type: '', text: '' });
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Login to your account' : 'Register for a new account'}
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div 
            className={`mb-4 p-4 rounded-lg ${
              message.type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Toggle Button */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleForm}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;