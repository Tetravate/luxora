import { useStore } from '../store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#111111] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10 toast-enter"
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />}
            {toast.type === 'info' && <Info size={18} className="text-amber-300 flex-shrink-0" />}
            <p className="text-sm font-medium leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/60 hover:text-white p-1 transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
