import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppSelector } from '../redux/hooks';

const Layout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full h-full p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
