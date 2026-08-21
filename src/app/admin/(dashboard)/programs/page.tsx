'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Plus, Search, Edit3, Trash2, Eye, EyeOff, Star, GripVertical } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  category: string | null;
  short_description: string | null;
  image_url: string | null;
  pricing_mode: string;
  price: number | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminProgramsPage() {
  const supabase = createClient();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchPrograms(); }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('programs').select('*').order('sort_order', { ascending: true });
    if (!error && data) setPrograms(data as Program[]);
    setLoading(false);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from('programs').update({ published: !current }).eq('id', id);
    if (!error) setPrograms(prev => prev.map(p => p.id === id ? { ...p, published: !current } : p));
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from('programs').update({ featured: !current }).eq('id', id);
    if (!error) setPrograms(prev => prev.map(p => p.id === id ? { ...p, featured: !current } : p));
  };

  const deleteProgram = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (!error) setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const filtered = programs.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-green" />
            Training Programs
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">Manage martial arts programs and pricing visibility.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm">
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
        <input type="text" placeholder="Search programs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-light rounded-lg text-sm text-foreground placeholder:text-foreground-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition" />
      </div>

      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-foreground-secondary">
            <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Loading programs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-foreground-secondary">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No programs found.</p>
            <p className="text-sm mt-1">Create your first training program to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border-light">
                  <th className="text-left px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">Program</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">Pricing</th>
                  <th className="text-center px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">Featured</th>
                  <th className="text-center px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-foreground-secondary text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map(program => (
                  <tr key={program.id} className="hover:bg-muted/20 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-foreground-secondary/30 flex-shrink-0 cursor-grab" />
                        <div>
                          <p className="font-semibold text-foreground">{program.title}</p>
                          {program.subtitle && <p className="text-xs text-foreground-secondary mt-0.5 truncate max-w-[200px]">{program.subtitle}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded text-foreground-secondary">{program.category || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium">
                        {program.pricing_mode === 'exact' && program.price ? `₹${program.price.toLocaleString('en-IN')}` : program.pricing_mode === 'enquire' ? 'Enquire' : program.pricing_mode === 'hidden' ? 'Hidden' : program.pricing_mode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => toggleFeatured(program.id, program.featured)} className={`p-1.5 rounded-lg transition ${program.featured ? 'text-amber-500 bg-amber-50' : 'text-foreground-secondary/30 hover:text-amber-500'}`}>
                        <Star className="w-4 h-4" fill={program.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => togglePublished(program.id, program.published)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition ${program.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {program.published ? <><Eye className="w-3 h-3" /> Live</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5 transition" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteProgram(program.id, program.title)} className="p-2 rounded-lg text-foreground-secondary hover:text-red-600 hover:bg-red-50 transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
