import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppSelector } from '../redux/hooks';

const Layout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-h-screen">

        <header className="h-20 bg-white/70 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-30 px-10 flex items-center justify-between shadow-sm">


          <div className="flex items-center gap-6 ml-auto">

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">Admin User</p>
                <p className="text-xs font-semibold text-slate-500">Superadmin</p>
              </div>
              <img src="/profileimage.jpg" alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-200 group-hover:border-indigo-600 transition-colors object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-10 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
