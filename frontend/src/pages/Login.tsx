import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { loginSuccess } from '../redux/slices/authSlice';
import axios from 'axios';
import { LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/login', { username, password });

      const { access_token, refresh_token } = res.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      const payload = JSON.parse(atob(access_token.split('.')[1]));

      dispatch(loginSuccess({ user_id: payload.user_id }));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900 bg-slate-50">
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to your MiniERP account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full h-12 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-200 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-indigo-600 relative overflow-hidden items-center justify-center px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
        <div className="absolute top-0 right-0 p-32 rounded-full bg-white opacity-5 mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 w-96 h-96"></div>
        <div className="absolute bottom-0 left-0 p-32 rounded-full bg-indigo-300 opacity-20 mix-blend-overlay filter blur-3xl transform -translate-x-1/2 translate-y-1/2 w-96 h-96"></div>

        <div className="relative z-10 text-white text-center max-w-lg">
          <h2 className="text-4xl font-bold mb-6">Manage Everything in One Place</h2>
          <p className="text-indigo-100 text-lg leading-relaxed">Access real-time analytics, process orders faster, and streamline your entire inventory workflow.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
