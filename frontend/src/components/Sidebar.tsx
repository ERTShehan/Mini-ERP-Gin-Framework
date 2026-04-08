import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 shadow-[20px_0_40px_rgba(0,0,0,0.1)] z-40">
      <div className="p-8 pb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">M</div>
        <h2 className="text-2xl font-bold tracking-tight">Mini<span className="text-indigo-400">ERP</span></h2>
      </div>

      <div className="px-6 py-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">Main Menu</h3>
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)] translate-x-2'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:translate-x-1'
                }`
              }
            >
              <item.icon size={20} className="stroke-[2.5px]" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 mb-4 border border-slate-700/50">
           <p className="text-sm font-semibold text-slate-200 mb-1">System Status</p>
           <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <p className="text-xs text-slate-400">All services operational</p>
           </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} className="stroke-[2.5px]" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
