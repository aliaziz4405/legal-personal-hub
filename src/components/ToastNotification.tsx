import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-xs text-slate-100 animate-in slide-in-from-bottom-5 duration-200">
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
      )}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
