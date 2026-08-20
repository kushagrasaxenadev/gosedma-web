'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Award, Plus, Edit3, Trash2, Eye, EyeOff, Star, CheckCircle, AlertCircle } from 'lucide-react';

interface FounderCredential {
  id: string;
  title: string;
  credential_type: string;
  event_name: string | null;
  result: string | null;
  year: string | null;
  location: string | null;
  description: string | null;
  verification_status: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

const CREDENTIAL_TYPES: Record<string, { label: string; icon: string }> = {
  award: { label: 'Award', icon: '🏆' },
  championship: { label: 'Championship', icon: '🥇' },
  certification: { label: 'Certification', icon: '📜' },
  recognition: { label: 'Recognition', icon: '🌟' },
  media: { label: 'Media Feature', icon: '📺' },
};

const VERIFICATION_STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Unverified', color: 'bg-gray-50 text-gray-500 border-gray-200' },
  client_verified: { label: 'Client Verified', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  source_verified: { label: 'Source Verified', color: 'bg-green-50 text-green-700 border-green-200' },
};

export default function AdminFounderPage() {
  const supabase = createClient();
  const [credentials, setCredentials] = useState<FounderCredential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCredentials(); }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('founder_credentials').select('*').order('sort_order', { ascending: true });
    if (!error && data) setCredentials(data as FounderCredential[]);
    setLoading(false);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from('founder_credentials').update({ published: !current }).eq('id', id);
    if (!error) setCredentials(prev => prev.map(c => c.id === id ? { ...c, published: !current } : c));
  };

  const deleteCredential = async (id: string, title: string) => {
    if (!confirm(`Delete credential "${title}"?`)) return;
    const { error } = await supabase.from('founder_credentials').delete().eq('id', id);
    if (!error) setCredentials(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-brand-deep-navy flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-green" />
            Founder Bio & Awards
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">Manage Richa Gaur&apos;s credentials and achievements with verification tracking.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm">
          <Plus className="w-4 h-4" /> Add Credential
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-foreground-secondary">
            <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Loading credentials...</p>
          </div>
        ) : credentials.length === 0 ? (
          <div className="p-12 text-center text-foreground-secondary">
            <Award className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No credentials yet.</p>
            <p className="text-sm mt-1">Add founder awards, certifications and achievements.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {credentials.map(cred => {
              const typeInfo = CREDENTIAL_TYPES[cred.credential_type] || { label: cred.credential_type, icon: '📋' };
              const verifyInfo = VERIFICATION_STATUS[cred.verification_status] || VERIFICATION_STATUS.draft;
              return (
                <div key={cred.id} className="p-5 hover:bg-muted/20 transition flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-navy/10 to-brand-green/10 flex items-center justify-center text-xl flex-shrink-0">
                    {typeInfo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${verifyInfo.color}`}>{verifyInfo.label}</span>
                      <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded text-foreground-secondary">{typeInfo.label}</span>
                      {cred.featured && <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />}
                    </div>
                    <h4 className="font-semibold text-brand-deep-navy truncate">{cred.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-foreground-secondary mt-1">
                      {cred.year && <span>{cred.year}</span>}
                      {cred.event_name && <span>• {cred.event_name}</span>}
                      {cred.location && <span>• {cred.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => togglePublished(cred.id, cred.published)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition ${cred.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {cred.published ? <><Eye className="w-3 h-3" /> Live</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                    </button>
                    <button className="p-2 rounded-lg text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5 transition"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => deleteCredential(cred.id, cred.title)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
