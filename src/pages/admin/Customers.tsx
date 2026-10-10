import { useState, useMemo } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export function Customers() {
  const { customers, deleteCustomer } = useAdminStore();
  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#111111]">Customers</h1>
        <p className="text-[#777777] mt-1 text-sm">Manage user accounts and view history.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E7E3DC]">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F5F1] rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F5F1] border-b border-[#E7E3DC]">
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Phone</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-[#F7F5F1]/50">
                  <td className="p-4 font-bold text-[#111111]">{c.name}</td>
                  <td className="p-4 text-sm text-[#777777]">{c.email}</td>
                  <td className="p-4 text-sm text-[#777777]">{c.phone || 'N/A'}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                      {c.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-[#777777] hover:bg-[#E7E3DC] rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(c.id!)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-[#777777]">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
