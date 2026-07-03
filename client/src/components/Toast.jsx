import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ id, message, type = 'info', duration = 4000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(autoCloseTimer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // match slide-out animation time
  };

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200 text-red-900',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
          icon: <Info className="w-5 h-5 text-brand-500" />,
        };
    }
  };

  const styles = getStyle();

  return (
    <div
      className={`pointer-events-auto border rounded-xl p-4 shadow-lg flex items-start gap-3 transition-all duration-300 w-full glass-card ${
        styles.bg
      } ${
        isExiting
          ? 'opacity-0 translate-y-[-10px] scale-95'
          : 'opacity-100 translate-y-0 scale-100 animate-[fadeInSlide_0.3s_ease-out_forwards]'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
      <div className="flex-1 text-sm font-medium pr-2 leading-relaxed">{message}</div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 rounded-lg p-0.5 transition-colors focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
