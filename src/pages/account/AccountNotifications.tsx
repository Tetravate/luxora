
import { useStore } from '../../store/useStore';
import { Bell, Check, Trash2 } from 'lucide-react';

export function AccountNotifications() {
  const { notifications = [], markNotificationRead, markAllNotificationsRead, deleteNotification } = useStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#111111]">
          <Bell size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#111111] mb-2">You're all caught up.</h2>
        <p className="text-[#777777] text-sm mb-6 max-w-md mx-auto">
          We'll let you know when there are updates to your orders or new promotions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7E3DC] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111] mb-1">Notifications</h2>
          <p className="text-sm text-[#777777]">Stay updated on your orders and offers.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllNotificationsRead}
            className="text-sm font-semibold text-[#111111] hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`p-5 rounded-2xl border transition-colors flex gap-4 ${notif.read ? 'bg-white border-[#E7E3DC]' : 'bg-[#F7F5F1]/50 border-[#111111]'}`}
          >
            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${notif.read ? 'bg-[#F7F5F1] text-[#777777]' : 'bg-[#111111] text-white'}`}>
              <Bell size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className={`font-bold ${notif.read ? 'text-[#111111]' : 'text-[#111111]'}`}>{notif.title}</h3>
                  <p className={`text-sm mt-1 ${notif.read ? 'text-[#777777]' : 'text-[#111111]'}`}>{notif.message}</p>
                </div>
                <span className="text-[10px] font-bold text-[#777777] whitespace-nowrap uppercase tracking-wider">{notif.date}</span>
              </div>
              <div className="mt-3 flex gap-3">
                {!notif.read && (
                  <button 
                    onClick={() => markNotificationRead(notif.id)}
                    className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
                  >
                    <Check size={12} /> Mark read
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notif.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
