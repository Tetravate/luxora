import { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { CategoryInfo } from '../../types';

export function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);

  const [formData, setFormData] = useState<Partial<CategoryInfo>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    itemCount: 0,
  });

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image: '', itemCount: 0 });
    setIsFormOpen(true);
  };

  const handleEdit = (cat: CategoryInfo) => {
    setEditingCategory(cat);
    setFormData(cat);
    setIsFormOpen(true);
  };

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(slug);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.slug, formData);
    } else {
      const newSlug = formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`;
      addCategory({ ...formData, slug: newSlug } as CategoryInfo);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111111]">Categories</h1>
          <p className="text-[#777777] mt-1 text-sm">Organize products into collections.</p>
        </div>
        <button onClick={handleCreate} className="bg-[#111111] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E7E3DC]">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search categories..." 
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
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Description</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Products</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]">
              {filteredCategories.map((cat) => (
                <tr key={cat.slug} className="hover:bg-[#F7F5F1]/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F7F5F1] overflow-hidden border border-[#E7E3DC]">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                        )}
                      </div>
                      <span className="font-bold text-[#111111]">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#777777] max-w-xs truncate">{cat.description}</td>
                  <td className="p-4 text-sm font-medium text-[#111111]">{cat.itemCount}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-1.5 text-[#777777] hover:bg-[#E7E3DC] rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(cat.slug)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-[#777777]">No categories found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-[#E7E3DC] flex justify-between">
              <h2 className="text-lg font-serif font-bold text-[#111111]">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setIsFormOpen(false)}><X size={20} className="text-[#777777]" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex-grow space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 bg-[#F7F5F1] rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Image URL</label>
                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-2 bg-[#F7F5F1] rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 bg-[#F7F5F1] rounded-xl text-sm resize-none"></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3 border rounded-xl font-semibold text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#111111] text-white rounded-xl font-semibold text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
