import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import type { Customer, Product, Order } from '../types';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    recentOrders: [] as Order[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [custRes, prodRes, ordRes] = await Promise.all([
          api.get<Customer[]>('/customers'),
          api.get<Product[]>('/products'),
          api.get<Order[]>('/orders')
        ]);

        const rev = ordRes.data.reduce((acc, curr) => curr.status === 'Cancel' ? acc : acc + curr.total_amount, 0);
        const recent = ordRes.data.sort((a, b) => b.id - a.id).slice(0, 4);

        setStats({
          customers: custRes.data?.length || 0,
          products: prodRes.data?.length || 0,
          orders: ordRes.data?.length || 0,
          revenue: rev,
          recentOrders: recent
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Revenue', value: `Rs. ${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500', trend: '+12%' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-indigo-500', trend: '+5%' },
    { title: 'Customers', value: stats.customers, icon: Users, color: 'bg-blue-500', trend: '+18%' },
    { title: 'Products', value: stats.products, icon: Package, color: 'bg-purple-500', trend: '+2%' },
  ];

  return (
    <div className="animate-fade-in-up duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your store today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col hover:shadow-md transition-shadow delay-${idx * 100} animate-fade-in-up group`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform`}>
                <card.icon size={22} className="stroke-[2.5px]" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                <TrendingUp size={14} /> {card.trend}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {loading ? '...' : card.value}
              </h3>
              <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
            <Link to="/orders" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">Loading...</div>
          ) : stats.recentOrders.length > 0 ? (
            <div className="space-y-5">
              {stats.recentOrders.map(o => (
                <div key={o.id} className="flex gap-4 items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${o.status === 'Success' ? 'bg-emerald-100 text-emerald-700' :
                    o.status === 'Cancel' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {o.status.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">Order #{o.id.toString().padStart(4, '0')}</p>
                    <p className="text-xs font-semibold text-slate-500">{new Date(o.order_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-800">Rs. {o.total_amount.toFixed(2)}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="text-slate-300 mb-3" size={32} />
              <p className="text-slate-500 font-medium">No recent orders.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
