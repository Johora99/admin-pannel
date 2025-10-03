// Register.jsx
import React, { useState } from 'react';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);
  const axiosPublic = useAxiosPublic();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axiosPublic.post('/api/auth/register', { name, email, password });
      console.log(res)
      setMsg({ type: 'success', text: res.data.message || 'Registered. Check email.' });
    } catch (err) {
      console.log(err)
      setMsg({ type: 'error', text: err.response?.data?.message || 'Registration failed.' });
    }
  }

  return (
    <div>
      <div className="w-full p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-blue-600 tracking-wide">THE APP</h1>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <p className="text-gray-500 text-sm mb-2">Start Your Journey</p>
            <h2 className="text-2xl font-semibold text-gray-800">Create Your Account</h2>
          </div>

          {/* Success/Error Message */}
          {msg && (
            <div className={`p-3 mb-4 rounded ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {msg.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">E-mail</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="test@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Register
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              Already have an account?{' '}
              <Link to={'/'} className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}