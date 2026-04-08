import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { loginSuccess } from '../redux/slices/authSlice';
import axios from 'axios';
import { Loader2, ArrowRight } from 'lucide-react';
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
      toast.success('Welcome to MiniERP Secure');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      <div className="w-full lg:w-5/12 flex flex-col relative z-10 bg-white">
        <div className="p-8 pb-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">M</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Mini<span className="text-indigo-600">ERP</span></h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 animate-slide-in-right">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Sign in securely</h2>
            <p className="text-slate-500">Access your enterprise dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1 group">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 group-focus-within:text-indigo-600 transition-colors">Admin Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 px-0 py-3 outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium text-lg placeholder-slate-300"
                placeholder="e.g. admin"
                required
              />
            </div>
            <div className="space-y-1 group pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 group-focus-within:text-indigo-600 transition-colors">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 px-0 py-3 outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-medium text-lg placeholder-slate-300"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all flex items-center justify-between px-6 mt-8 group"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500 font-medium">
            Protected by JWT Architecture & TLS encryption.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-7/12 relative overflow-hidden">
        <img src="/login.png" alt="Enterprise Corporate Setup" className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-indigo-900/20 mix-blend-overlay"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-end p-20 pb-24 text-white">
          <div className="glass-dark p-10 rounded-3xl border border-white/10 max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in-up">
            <h3 className="text-3xl font-bold mb-4 tracking-tight leading-tight">Elevate your operational capability.</h3>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">MiniERP isn't just an interface; it's a completely integrated nervous system for your daily enterprise needs.</p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <img src="https://i.pravatar.cc/100?img=1" className="w-12 h-12 rounded-full border-2 border-slate-800" alt="user" />
                <img src="https://i.pravatar.cc/100?img=2" className="w-12 h-12 rounded-full border-2 border-slate-800" alt="user" />
                <img src="https://i.pravatar.cc/100?img=3" className="w-12 h-12 rounded-full border-2 border-slate-800" alt="user" />
              </div>
              <p className="text-sm font-medium text-slate-400">Trusted by over <strong className="text-white">10k+</strong> admins globally.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
