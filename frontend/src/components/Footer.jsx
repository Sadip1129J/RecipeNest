// Footer.jsx — Refactored to pure Tailwind CSS
import { Link } from 'react-router-dom';
import { Mail, Camera, Globe, MessageCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Bio */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <path d="M22 28C16 28 12 23 12 18C12 13 16 9 21 9C22.5 5.5 26 3 30 3C34 3 37.5 5.5 39 9C44 9 48 13 48 18C48 23 44 28 38 28" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <path d="M14 36C14 36 18 42 32 42C46 42 50 36 50 36" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">
                Recipe<span className="text-primary">Nest</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Empowering culinary enthusiasts to discover, share, and master the art of fine cooking with world-class chefs.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {[
                { icon: Camera, label: 'Instagram' },
                { icon: Globe, label: 'Website' },
                { icon: MessageCircle, label: 'Chat' },
              ].map(({ icon: Icon, label }) => (
                <a 
                  key={label} 
                  href="#" 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary text-muted hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Explore</h4>
            <ul className="space-y-4">
              {[
                { label: 'Browse Recipes', to: '/recipes' },
                { label: 'Our Chefs', to: '/chefs' },
                { label: 'Categories', to: '/recipes' },
                { label: 'Trending Now', to: '/recipes' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted hover:text-primary hover:pl-1 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', to: '/' },
                { label: 'Chef Portal', to: '/register' },
                { label: 'Community Guidelines', to: '/' },
                { label: 'Help Center', to: '/' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted hover:text-primary hover:pl-1 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold mb-6">Stay Inspired</h4>
            <p className="text-sm text-muted leading-relaxed">
              Subscribe to our weekly newsletter for the latest recipes and chef tips.
            </p>
            <form className="relative group" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full pl-4 pr-12 py-3 bg-secondary border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                <ArrowRight size={18} />
              </button>
            </form>
            <div className="flex items-center gap-2 text-xs text-subtle pt-2">
              <Mail size={14} className="text-primary" />
              <span>hello@recipenest.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[13px] text-subtle">
            © {currentYear} RecipeNest. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-[13px] text-subtle hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
