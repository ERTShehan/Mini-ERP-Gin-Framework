import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0');
        }
      });
    });

    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">

      <nav className="fixed w-full z-50 glass-dark transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">M</div>
            <h1 className="text-2xl font-bold tracking-tight">Mini<span className="text-indigo-400">ERP</span></h1>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#features" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition">Features</a>
            <a href="#benefits" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition">Benefits</a>
            <Link to="/login" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium rounded-full backdrop-blur-md transition-all flex items-center gap-2 group">
              Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/hero.png" alt="Digital Workspace" className="w-full h-full object-cover opacity-30 transform scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-3xl animate-fade-in-up">

            <h2 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
              Manage your business <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">intelligently.</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Don't get bogged down by complex software. MiniERP provides a minimal, blazing-fast, and secure platform to track customers, inventory, and scale your operations seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-full shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:bg-indigo-500 hover:-translate-y-1 transition-all text-center">
                Get Started Now
              </Link>
              <a href="#features" className="px-8 py-4 bg-slate-800 text-slate-200 font-medium rounded-full border border-slate-700 hover:bg-slate-700 transition-all text-center">
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 relative z-10 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20 scroll-animate opacity-0">
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Designed for speed & clarity</h3>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">Everything you need to run your daily operations is housed under one lightning-fast roof. No bloatware.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-dark p-8 rounded-3xl border border-slate-800 hover:-translate-y-2 hover:border-indigo-500/50 transition-all duration-300 scroll-animate opacity-0 group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white">Unified Dashboard</h4>
              <p className="text-slate-400 leading-relaxed">Visualize your revenue, order volume, and active customers in a single, perfectly laid out command center.</p>
            </div>
            <div className="glass-dark p-8 rounded-3xl border border-slate-800 hover:-translate-y-2 hover:border-emerald-500/50 transition-all duration-300 scroll-animate opacity-0 delay-100 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <TrendingUp size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white">Live Operations</h4>
              <p className="text-slate-400 leading-relaxed">Create products, manage stocks, and take live orders with automated complex recalculations happening in milliseconds.</p>
            </div>
            <div className="glass-dark p-8 rounded-3xl border border-slate-800 hover:-translate-y-2 hover:border-purple-500/50 transition-all duration-300 scroll-animate opacity-0 delay-200 group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white">Bank-Grade Security</h4>
              <p className="text-slate-400 leading-relaxed">Built on a solid Golang backend with stateless JWT architecture ensuring your corporate data is never compromised.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-24 relative z-10 bg-slate-900 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <div className="scroll-animate opacity-0 order-2 lg:order-1">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Experience operations without limits.</h3>
            <p className="text-slate-400 mb-8 leading-relaxed text-lg">
              Unlike traditional clunky ERPs, MiniERP uses optimistic UI updates, background polling, and a highly responsive design to make you feel like you are driving a sports car.
            </p>
            <ul className="space-y-5 mb-10">
              <li className="flex items-center gap-4 text-slate-300">
                <CheckCircle2 className="text-indigo-400" size={24} /> <span>Automatic Stock Restocking on Cancellations</span>
              </li>
              <li className="flex items-center gap-4 text-slate-300">
                <CheckCircle2 className="text-indigo-400" size={24} /> <span>Atomic Database Transactions ensuring zero data loss</span>
              </li>
              <li className="flex items-center gap-4 text-slate-300">
                <CheckCircle2 className="text-indigo-400" size={24} /> <span>Beautifully crafted interface with Glassmorphism</span>
              </li>
            </ul>
            <Link to="/login" className="px-8 py-3.5 bg-white text-slate-900 font-bold rounded-full hover:bg-indigo-50 transition-colors inline-block">
              Launch Dashboard
            </Link>
          </div>
          <div className="scroll-animate opacity-0 order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden glass-dark p-2 border border-slate-700 shadow-2xl shadow-indigo-900/20 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 mix-blend-overlay"></div>
              <img src="/feature.png" alt="Dashboard Representation" className="rounded-2xl w-full h-auto shadow-inner animate-float object-cover" style={{ minHeight: '300px' }} />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs">M</div>
              <h1 className="text-xl font-bold tracking-tight">Mini<span className="text-indigo-400">ERP</span></h1>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">Simplifying complex enterprise workflows with high-end technology and beautiful design.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition">Integrations</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-500 text-sm">© 2026 MiniERP Systems Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-500 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
