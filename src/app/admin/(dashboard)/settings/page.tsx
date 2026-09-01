'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Settings, Save, Globe, Phone, Mail, MessageSquare, MapPin, ExternalLink } from 'lucide-react';

interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, string | boolean | number>;
  description: string | null;
}

const SETTING_GROUPS = [
  {
    title: 'Contact Information',
    icon: Phone,
    keys: ['primary_phone', 'primary_email', 'whatsapp_number', 'primary_address'],
  },
  {
    title: 'Social Media Links',
    icon: Globe,
    keys: ['facebook_url', 'instagram_url', 'youtube_url', 'twitter_url', 'linkedin_url'],
  },
  {
    title: 'Hero Section',
    icon: ExternalLink,
    keys: ['hero_headline', 'hero_subheadline', 'hero_cta_text', 'hero_cta_url'],
  },
];

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error: fetchErr } = await supabase.from('site_settings').select('*');
    if (!fetchErr && data) {
      const map: Record<string, string> = {};
      (data as any[]).forEach(s => {
        const raw = s.value;
        if (typeof raw === 'object' && raw !== null && 'value' in raw) {
          map[s.key] = String(raw.value);
        } else if (typeof raw === 'string') {
          map[s.key] = raw;
        }

        // Unpack structured seed data if present
        if (s.key === 'social_links' && typeof raw === 'object' && raw !== null) {
          if (raw.youtube && !map['youtube_url']) map['youtube_url'] = String(raw.youtube);
          if (raw.facebook && !map['facebook_url']) map['facebook_url'] = String(raw.facebook);
          if (raw.instagram && !map['instagram_url']) map['instagram_url'] = String(raw.instagram);
        }
        if (s.key === 'contact_details' && typeof raw === 'object' && raw !== null) {
          if (raw.phone && !map['primary_phone']) map['primary_phone'] = String(raw.phone);
          if (raw.email && !map['primary_email']) map['primary_email'] = String(raw.email);
          if (raw.whatsapp && !map['whatsapp_number']) map['whatsapp_number'] = String(raw.whatsapp);
          if (raw.address && !map['primary_address']) map['primary_address'] = String(raw.address);
        }
      });
      setSettings(map);
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
    setError(null);
  };

  const saveAllSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      for (const [key, value] of Object.entries(settings)) {
        if (!key || key === 'social_links' || key === 'contact_details') continue;
        const { error: upsertErr } = await supabase.from('site_settings').upsert({
          key,
          value: { value: String(value) },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

        if (upsertErr) {
          throw new Error(`Failed to save "${formatLabel(key)}": ${upsertErr.message}`);
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const formatLabel = (key: string) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace('Url', 'URL').replace('Cta', 'CTA');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-green" />
            Global Settings
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">Configure site-wide contact details, social links, and hero content.</p>
        </div>
        <button onClick={saveAllSettings} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm disabled:opacity-50 cursor-pointer">
          {saving ? (
            <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
          ) : saved ? (
            <><Save className="w-4 h-4" /> Saved Successfully!</>
          ) : (
            <><Save className="w-4 h-4" /> Save All Settings</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-surface rounded-xl border border-border-light p-12 text-center text-foreground-secondary">
          <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm font-medium">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {SETTING_GROUPS.map(group => {
            const Icon = group.icon;
            return (
              <div key={group.title} className="bg-surface rounded-xl border border-border-light shadow-sm p-6">
                <h3 className="flex items-center gap-2 font-heading font-bold text-foreground mb-5">
                  <Icon className="w-5 h-5 text-brand-green" />
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.keys.map(key => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-1.5">
                        {formatLabel(key)}
                      </label>
                      <input
                        type={key.includes('url') || key.includes('email') ? 'url' : key.includes('phone') || key.includes('whatsapp') ? 'tel' : 'text'}
                        value={settings[key] || ''}
                        onChange={e => handleChange(key, e.target.value)}
                        placeholder={`Enter ${formatLabel(key).toLowerCase()}...`}
                        className="w-full px-4 py-2.5 bg-surface border border-border-light rounded-lg text-sm text-foreground placeholder:text-foreground-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
