import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { Product } from '../../types';

export function Products() {
  const { products, deleteProduct, addProduct, updateProduct, categories } = useAdminStore();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: '',
    price: 0,
    originalPrice: undefined,
    stock: 0,
    description: '',
    images: [''],
    colors: [],
    sizes: [],
    bestSeller: false,
    newArrival: false,
    featured: false,
    onSale: false,
  });

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '', brand: '', category: categories[0]?.name || '', price: 0, stock: 10, description: '', images: [''], colors: [], sizes: []
    });
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct({
        ...formData,
        id: `prod-${Date.now()}`,
        slug: formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `prod-${Date.now()}`,
        rating: 0,
        reviewCount: 0,
      } as Product);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111111]">Products</h1>
          <p className="text-[#777777] mt-1 text-sm">Manage your product catalog, pricing, and inventory.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-[#111111] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E7E3DC] flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F5F1] border border-transparent focus:border-[#E7E3DC] rounded-xl text-sm outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-[#E7E3DC] rounded-xl text-sm font-medium text-[#111111] hover:bg-[#F7F5F1] transition-colors">
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F7F5F1] border-b border-[#E7E3DC]">
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Product</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Stock</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#F7F5F1]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F7F5F1] overflow-hidden border border-[#E7E3DC]">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111111]">{product.name}</p>
                        <p className="text-xs text-[#777777]">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#111111]">{product.category}</td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-[#111111]">${(product.price || 0).toFixed(2)}</div>
                  </td>
                  <td className="p-4 text-sm">
                    {product.stock > 0 ? (
                      <span className="text-[#111111] font-medium">{product.stock} in stock</span>
                    ) : (
                      <span className="text-red-600 font-medium">Out of stock</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#E7E3DC] rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#777777]">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            <div className="p-6 border-b border-[#E7E3DC] flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-serif font-bold text-[#111111]">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 text-[#777777] hover:bg-[#F7F5F1] rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex-grow space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Product Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Brand</label>
                    <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-4 py-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Category *</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-xl text-sm">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Price ($) *</label>
                  <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Stock *</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value, 10)})} className="w-full px-4 py-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-xl text-sm" />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Image URL</label>
                <input type="url" value={formData.images?.[0] || ''} onChange={e => setFormData({...formData, images: [e.target.value]})} className="w-full px-4 py-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-xl text-sm" placeholder="https://..." />
                {formData.images?.[0] && <img src={formData.images[0]} alt="Preview" className="mt-3 w-24 h-24 object-cover rounded-xl border border-[#E7E3DC]" />}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-xl text-sm resize-none"></textarea>
              </div>

              {/* Flags */}
              <div className="space-y-3 p-4 bg-[#F7F5F1] rounded-xl border border-[#E7E3DC]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded text-[#111111]" />
                  <span className="text-sm font-medium text-[#111111]">Featured Product</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({...formData, newArrival: e.target.checked})} className="rounded text-[#111111]" />
                  <span className="text-sm font-medium text-[#111111]">New Arrival</span>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-[#E7E3DC] flex gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3 bg-white border border-[#E7E3DC] text-[#111111] rounded-xl font-semibold text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#111111] text-white rounded-xl font-semibold text-sm">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
