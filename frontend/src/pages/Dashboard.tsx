import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';
import type { Customer, Product, Order } from '../types';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0
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

        // Exclude cancelled orders from revenue calculation
        const rev = ordRes.data.reduce((acc, curr) => curr.status === 'Cancel' ? acc : acc + curr.total_amount, 0);

        setStats({
          customers: custRes.data?.length || 0,
          products: prodRes.data?.length || 0,
          orders: ordRes.data?.length || 0,
          revenue: rev
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
    { title: 'Total Revenue', value: `Rs. ${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-indigo-500' },
    { title: 'Customers', value: stats.customers, icon: Users, color: 'bg-blue-500' },
    { title: 'Products in DB', value: stats.products, icon: Package, color: 'bg-purple-500' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-inner`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {loading ? '...' : card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to your ERP</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          From the left sidebar, you can manage your customers, update product inventory, and process new orders. Operations are handled instantly.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
