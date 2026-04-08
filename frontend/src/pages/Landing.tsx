import { Link } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Mini<span className="text-slate-800">ERP</span></h1>
        <Link to="/login" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition">
          Sign In
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto -mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          Now v1.0 Available
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
          Manage your enterprise <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">effortlessly.</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl">
          The all-in-one minimal ERP system built for small businesses. Manage customers, handle products, and take orders at lightning speed.
        </p>
        <div className="flex gap-4">
          <Link to="/login" className="px-8 py-3.5 bg-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
            Get Started
          </Link>
          <a href="#features" className="px-8 py-3.5 bg-white text-slate-700 font-medium rounded-xl border shadow-sm hover:bg-slate-50 transition-all">
            Learn More
          </a>
        </div>
      </main>

      <section id="features" className="bg-white py-24 border-t">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="p-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 mx-auto md:mx-0">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Intuitive Dashboard</h3>
            <p className="text-slate-600 leading-relaxed">Everything at a glance. Understand your business metrics clearly without navigating through complex menus.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 mx-auto md:mx-0">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-slate-600 leading-relaxed">Optimized React architecture and Go backend ensures sub-millisecond responses for order processing.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 mx-auto md:mx-0">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Access</h3>
            <p className="text-slate-600 leading-relaxed">JWT driven authentication with auto token renewals ensures your data is only accessible to you.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
