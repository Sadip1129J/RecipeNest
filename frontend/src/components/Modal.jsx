// Modal.jsx — A reusable, animated modal component for confirmations
import { X, AlertTriangle } from 'lucide-react';

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-primary/5 text-primary'}`}>
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-subtle hover:text-foreground hover:bg-secondary rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted leading-relaxed mb-8">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onClose}
              className="flex-1 btn btn-outline py-3.5"
            >
              Cancel
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 btn py-3.5 text-white ${type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200' : 'btn-primary'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
