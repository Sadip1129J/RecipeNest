// ChefCard.jsx — Refactored for Light Orange theme and centered alignment
import { Link } from 'react-router-dom';
import { MapPin, ChefHat } from 'lucide-react';

export default function ChefCard({ chef }) {
  return (
    <div className="card group flex flex-col items-center text-center p-6 transition-all duration-300">
      {/* Profile Image Container */}
      <div className="relative w-32 h-32 mb-6 rounded-full p-1 bg-gradient-to-tr from-primary to-amber-200">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={chef.profileImageUrl || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400'}
            alt={chef.displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400'; }}
          />
        </div>
        <div className="absolute -bottom-1 -right-1 p-2 bg-primary text-white rounded-full shadow-md">
          <ChefHat size={16} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center">
        <h3 className="text-xl font-serif font-bold text-foreground mb-2">
          {chef.displayName}
        </h3>
        
        {chef.location && (
          <div className="flex items-center gap-1.5 text-muted text-sm font-medium mb-4">
            <MapPin size={14} className="text-primary" /> 
            {chef.location}
          </div>
        )}

        <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-3 max-w-[240px]">
          {chef.bio || 'Professional chef sharing culinary secrets and authentic recipes.'}
        </p>

        {/* Specialties Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {chef.specialties?.slice(0, 3).map(s => (
            <span 
              key={s} 
              className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full border border-primary/10"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button - Uses new Light Orange theme */}
      <Link 
        to={`/chefs/${chef.id}`} 
        className="btn btn-outline w-full rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-bold"
      >
        View Portfolio
      </Link>
    </div>
  );
}
