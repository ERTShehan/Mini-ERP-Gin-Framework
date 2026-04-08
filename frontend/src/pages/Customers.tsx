import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Customer } from '../types';

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: 0, name: '', email: '', phone: '', address: '' });
  const [isEdit, setIsEdit] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch customers');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openModal = (cust?: Customer) => {
    if (cust) {
      setFormData(cust);
      setIsEdit(true);
    } else {
      setFormData({ id: 0, name: '', email: '', phone: '', address: '' });
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/customers/${formData.id}`, formData);
        toast.success('Customer updated');
      } else {
        await api.post('/customers', formData);
        toast.success('Customer added');
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error saving customer');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Customer deleted');
      fetchCustomers();
    } catch (err) {
      toast.error('Failed to delete customer');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
        >
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60 text-slate-500 text-sm">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Address</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{c.name}</td>
                <td className="p-4 text-slate-600">{c.email}</td>
                <td className="p-4 text-slate-600">{c.phone}</td>
                <td className="p-4 text-slate-600 truncate max-w-50">{c.address}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openModal(c)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No customers found. Add one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Edit Customer" : "Add Customer"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input required type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows={3}></textarea>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Save Customer</button>
        </form>
      </Modal>
    </div>
  );
};
export default Customers;
