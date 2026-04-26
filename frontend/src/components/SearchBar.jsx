import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search recipes..." }) {
  return (
    <div className="relative group">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-primary transition-colors" />
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
