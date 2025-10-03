// Login.jsx
import React, { useEffect, useState } from 'react';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [msg, setMsg] = useState(null);
  const axiosPublic = useAxiosPublic();
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('verified') === 'true') {
    setMsg({ type: 'success', text: 'Email verified! Please login.' });
  }
}, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axiosPublic.post('/api/auth/login', { email, password });
      console.log(res)
      if(res.data.token){
        console.log(res.data)
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userEmail', res.data.email)
        // redirect to admin
        window.location.href = '/admin';
      }else{
        window.location.href = '/login';
      }
    } catch (err) {
      const text = err.response?.data?.message || 'Login failed';
      console.log(err)
      setMsg({ type: 'error', text });
    }
  }

  return (
    <div>
      <div className="w-full p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-2xl lg:text-3xl font-bold text-blue-600 tracking-wide">MY DASHBOARD</h1>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <p className="text-gray-500 text-sm mb-2">Welcome Back!</p>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">Log in to Access Your Account</h2>
          </div>

          {/* Error Message */}
          {msg && (
            <div className={`p-3 mb-4 rounded ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {msg.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Don't have an account?{' '}
              <Link to={'/register'} className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </span>
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Geometric Background */}
    </div>
  );
}