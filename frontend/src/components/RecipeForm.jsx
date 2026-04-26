// RecipeForm.jsx — Reusable form for adding/editing recipes
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Clock, Users, Tags, Utensils } from 'lucide-react';
import { categoryService } from '../services/categoryService';

export default function RecipeForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    categoryId: '',
    prepTime: '',
    servings: 1,
    tags: [],
    ingredients: [''],
    instructions: ['']
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
    if (initialData) {
      setFormData({
        ...initialData,
        ingredients: initialData.ingredients?.length ? initialData.ingredients : [''],
        instructions: initialData.instructions?.length ? initialData.instructions : [''],
        tags: initialData.tags || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, type) => {
    const newArr = [...formData[type]];
    newArr[index] = value;
    setFormData(prev => ({ ...prev, [type]: newArr }));
  };

  const addField = (type) => {
    setFormData(prev => ({ ...prev, [type]: [...prev[type], ''] }));
  };

  const removeField = (index, type) => {
    if (formData[type].length <= 1) return;
    const newArr = formData[type].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [type]: newArr }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="label">Recipe Title</label>
            <input 
              name="title" value={formData.title} onChange={handleChange}
              className="input text-lg font-bold" placeholder="e.g. Traditional Chicken Momo" required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange}
              className="input min-h-[120px] py-3 leading-relaxed" 
              placeholder="Tell the story of your dish..." required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-2"><Clock size={14} /> Prep Time</label>
              <input 
                name="prepTime" value={formData.prepTime} onChange={handleChange}
                className="input" placeholder="e.g. 45 min" required
              />
            </div>
            <div>
              <label className="label flex items-center gap-2"><Users size={14} /> Servings</label>
              <input 
                type="number" name="servings" value={formData.servings} onChange={handleChange}
                className="input" min="1" required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select 
                name="categoryId" value={formData.categoryId} onChange={handleChange}
                className="input appearance-none bg-white" required
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label flex items-center gap-2"><Image size={14} /> Image URL</label>
              <input 
                name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                className="input" placeholder="https://unsplash.com/..."
              />
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-2"><Tags size={14} /> Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map(t => (
                <span key={t} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-2">
                  #{t} <X size={12} className="cursor-pointer" onClick={() => removeTag(t)} />
                </span>
              ))}
            </div>
            <input 
              value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag}
              className="input" placeholder="Press Enter to add tags"
            />
          </div>
        </div>

        {/* Right Column: Ingredients & Instructions */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="label flex items-center gap-2 !mb-0"><Utensils size={14} /> Ingredients</label>
              <button type="button" onClick={() => addField('ingredients')} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <Plus size={14} /> Add Ingredient
              </button>
            </div>
            <div className="space-y-3">
              {formData.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 group">
                  <input 
                    value={ing} onChange={e => handleArrayChange(i, e.target.value, 'ingredients')}
                    className="input py-2.5" placeholder={`Ingredient ${i + 1}`} required
                  />
                  <button 
                    type="button" onClick={() => removeField(i, 'ingredients')}
                    className="p-2.5 text-subtle hover:text-destructive hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="label flex items-center gap-2 !mb-0"><Plus size={14} /> Instructions</label>
              <button type="button" onClick={() => addField('instructions')} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <Plus size={14} /> Add Step
              </button>
            </div>
            <div className="space-y-4">
              {formData.instructions.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-secondary text-muted flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <textarea 
                    value={step} onChange={e => handleArrayChange(i, e.target.value, 'instructions')}
                    className="input py-3 min-h-[80px]" placeholder={`Step ${i + 1}`} required
                  />
                  <button 
                    type="button" onClick={() => removeField(i, 'instructions')}
                    className="p-2.5 text-subtle hover:text-destructive hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 h-10 mt-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-10 border-t border-border">
        <button type="button" onClick={onCancel} className="btn btn-outline px-10 py-3.5">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary px-12 py-3.5 shadow-xl shadow-primary/20">
          {loading ? 'Processing...' : initialData ? 'Update Recipe' : 'Publish Recipe'}
        </button>
      </div>
    </form>
  );
}
