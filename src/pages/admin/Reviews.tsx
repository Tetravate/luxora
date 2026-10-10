import { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Star, CheckCircle, XCircle, Trash2, Search, Eye } from 'lucide-react';
import type { Review } from '../../store/useAdminStore';

export function Reviews() {
  const { reviews, updateReviewStatus, deleteReview } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesRating = filterRating === 'all' || r.rating.toString() === filterRating;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#111111]">Reviews</h1>
        <p className="text-[#777777] mt-1 text-sm">Moderate customer product reviews.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
          <input 
            type="text" 
            placeholder="Search reviews or customers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E7E3DC] rounded-xl text-sm focus:outline-none focus:border-[#111111]"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterRating} 
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E7E3DC] rounded-xl text-sm focus:outline-none focus:border-[#111111]"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E7E3DC] rounded-xl text-sm focus:outline-none focus:border-[#111111]"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F7F5F1] border-b border-[#E7E3DC]">
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Rating</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Review</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]">
              {filteredReviews.map((r) => (
                <tr key={r.id} className="hover:bg-[#F7F5F1]/50">
                  <td className="p-4">
                    <span className="font-bold text-[#111111]">{r.customerName}</span>
                    <span className="block text-xs text-[#777777]">
                      {new Date(r.date).toLocaleDateString()}
                    </span>
                    {r.verifiedPurchase && <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1 rounded border border-emerald-200 mt-1 inline-block">Verified Purchase</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < r.rating ? 'fill-current' : 'text-gray-300'} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#777777] max-w-sm truncate">
                    {r.title && <span className="font-bold text-[#111111] block mb-0.5">{r.title}</span>}
                    {r.comment}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                      ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${r.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                      ${r.status === 'Hidden' ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedReview(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details"><Eye size={16} /></button>
                      {r.status !== 'Approved' && (
                        <button onClick={() => updateReviewStatus(r.id, 'Approved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Approve"><CheckCircle size={16} /></button>
                      )}
                      {r.status !== 'Hidden' && (
                        <button onClick={() => updateReviewStatus(r.id, 'Hidden')} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg" title="Hide"><XCircle size={16} /></button>
                      )}
                      <button onClick={() => deleteReview(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#777777] text-sm">No reviews match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Review Details</h2>
            <div className="space-y-4 text-sm">
              <div><strong className="text-[#111111]">Customer:</strong> {selectedReview.customerName}</div>
              <div><strong className="text-[#111111]">Product ID:</strong> {selectedReview.productId}</div>
              <div className="flex items-center gap-2"><strong className="text-[#111111]">Rating:</strong> 
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < selectedReview.rating ? 'fill-current' : 'text-gray-300'} />)}
                </div>
              </div>
              {selectedReview.title && <div><strong className="text-[#111111]">Title:</strong> {selectedReview.title}</div>}
              <div><strong className="text-[#111111]">Content:</strong> <p className="mt-1 p-3 bg-[#F7F5F1] rounded-xl">{selectedReview.comment}</p></div>
              <div className="flex items-center gap-4 text-xs mt-4">
                <button onClick={() => setSelectedReview(null)} className="px-4 py-2 border rounded-xl font-bold">Close</button>
                {selectedReview.status !== 'Approved' && <button onClick={() => { updateReviewStatus(selectedReview.id, 'Approved'); setSelectedReview(null); }} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">Approve</button>}
                {selectedReview.status !== 'Hidden' && <button onClick={() => { updateReviewStatus(selectedReview.id, 'Hidden'); setSelectedReview(null); }} className="px-4 py-2 bg-amber-600 text-white rounded-xl font-bold">Hide</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
