import React from 'react';
import { BookOpen } from 'lucide-react';

const EmptyState = ({ title, description, icon: Icon = BookOpen, actionText, onActionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 glass-card rounded-2xl border border-slate-100 max-w-md mx-auto my-8 fade-in-slide">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
        <Icon className="w-8 h-8 text-brand-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-xs">{description}</p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="py-2.5 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all focus:outline-none"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
