import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Order, Customer, Product } from '../types';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<{ product_id: number, quantity: number }[]>([]);

  const fetchInitialData = async () => {
    try {
      const [ordRes, custRes, prodRes] = await Promise.all([
        api.get('/orders'),
        api.get('/customers'),
        api.get('/products')
      ]);
      setOrders(ordRes.data || []);
      setCustomers(custRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      toast.error('Failed to load order data');
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product_id: 0, quantity: 1 }]);
  };

  const handleItemChange = (index: number, field: 'product_id' | 'quantity', value: number) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      return toast.error("Please select a customer");
    }

    const validItems = orderItems.filter(i => i.product_id !== 0 && i.quantity > 0);
    if (validItems.length === 0) {
      return toast.error("Please add at least one valid product");
    }

    try {
      await api.post('/orders', {
        customer_id: selectedCustomer,
        items: validItems
      });
      toast.success('Order placed successfully!');
      setIsModalOpen(false);
      setOrderItems([]);
      setSelectedCustomer(0);
      fetchInitialData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (newStatus === 'Cancel') {
      if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored and this cannot be undone.')) {
        return;
      }
    } else {
      if (!window.confirm(`Update order status to ${newStatus}?`)) {
        return;
      }
    }

    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchInitialData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((acc, item) => {
      const prod = products.find(p => p.id === item.product_id);
      return acc + (prod ? prod.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <button
          onClick={() => {
            setOrderItems([{ product_id: 0, quantity: 1 }]);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
        >
          <Plus size={18} /> Place Order
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60 text-slate-500 text-sm">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium flex items-center justify-end">Total Amount</th>
              <th className="p-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => {
              const cust = customers.find(c => c.id === o.customer_id);
              return (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">ORD-{o.id.toString().padStart(4, '0')}</td>
                  <td className="p-4 text-slate-700">{cust?.name || 'Unknown'}</td>
                  <td className="p-4 text-slate-600">{new Date(o.order_date).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-slate-800 text-right pr-6">Rs. {o.total_amount.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    {o.status === 'Cancel' ? (
                       <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                         Cancel
                       </span>
                    ) : (
                      <select 
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="p-1 border rounded text-xs font-semibold bg-slate-50 text-slate-700 outline-none w-24 text-center cursor-pointer hover:bg-slate-100"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Success">Success</option>
                        <option value="Cancel">Cancel</option>
                      </select>
                    )}
                  </td>
                </tr>
              )
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No orders found. Create one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Order">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(Number(e.target.value))}
              required
            >
              <option value={0}>Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700">Products in Order</label>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border">
                  <div className="flex-1">
                    <select
                      className="w-full p-1.5 border rounded-md text-sm outline-none bg-white"
                      value={item.product_id}
                      onChange={(e) => handleItemChange(idx, 'product_id', Number(e.target.value))}
                    >
                      <option value={0}>Select Product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id} disabled={p.stock_qty <= 0}>
                          {p.name} (Rs. {p.price}) - {p.stock_qty} left
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      className="w-full p-1.5 border rounded-md text-sm outline-none text-center bg-white"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                    />
                  </div>
                  <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={handleAddItem} className="mt-3 flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800">
              <Plus size={16} /> Add another item
            </button>
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <span className="font-medium text-slate-700">Estimated Total:</span>
            <span className="text-xl font-bold text-slate-900">Rs. {calculateTotal().toFixed(2)}</span>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition mt-6">
            Confirm & Place Order
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;
