import { SlidersHorizontal, X } from 'lucide-react';

export default function CategoryFilter({ categories, activeCategory, onCategoryClick }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <label className="text-xs font-bold text-subtle uppercase tracking-widest">Categories</label>
        <SlidersHorizontal size={14} className="text-subtle" />
      </div>
      <div className="flex flex-wrap lg:flex-col gap-2">
        {['All', ...categories.map(c => c.name || c)].map(cat => (
          <button 
            key={cat} 
            onClick={() => onCategoryClick(cat)}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
              activeCategory === cat 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'bg-white border border-border text-muted hover:bg-secondary hover:text-foreground'
            }`}
          >
            {cat}
            {activeCategory === cat && <X size={14} />}
          </button>
        ))}
      </div>
    </div>
  );
}
