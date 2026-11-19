import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '@/lib/store';

const config = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', iconColor: 'text-emerald-400' },
  error: { icon: XCircle, bg: 'bg-red-500/15', border: 'border-red-500/40', text: 'text-red-400', iconColor: 'text-red-400' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-400', iconColor: 'text-amber-400' },
  info: { icon: Info, bg: 'bg-sky-500/15', border: 'border-sky-500/40', text: 'text-sky-400', iconColor: 'text-sky-400' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 w-96 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => {
        const c = config[t.type];
        const Icon = c.icon;
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-xl border ${c.border} ${c.bg} bg-slate-900/95 backdrop-blur px-4 py-3 shadow-xl animate-slide-in-right`}
          >
            <Icon className={`h-5 w-5 ${c.iconColor} shrink-0 mt-0.5`} />
            <p className="text-sm text-slate-200 flex-1">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-500 hover:text-white transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
