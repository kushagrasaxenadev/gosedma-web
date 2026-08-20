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

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data) {
      const map: Record<string, string> = {};
      (data as SiteSetting[]).forEach(s => {
        if (typeof s.value === 'object' && s.value !== null && 'value' in s.value) {
          map[s.key] = String(s.value.value);
        } else {
          map[s.key] = JSON.stringify(s.value);
        }
      });
      setSettings(map);
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const saveAllSettings = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert({
        key,
        value: { value },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const formatLabel = (key: string) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace('Url', 'URL').replace('Cta', 'CTA');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-brand-deep-navy flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-green" />
            Global Settings
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">Configure site-wide contact details, social links, and hero content.</p>
        </div>
        <button onClick={saveAllSettings} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm disabled:opacity-50">
          {saving ? (
            <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
          ) : saved ? (
            <><Save className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save All Settings</>
          )}
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-border-light p-12 text-center text-foreground-secondary">
          <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm font-medium">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {SETTING_GROUPS.map(group => {
            const Icon = group.icon;
            return (
              <div key={group.title} className="bg-white rounded-xl border border-border-light shadow-sm p-6">
                <h3 className="flex items-center gap-2 font-heading font-bold text-brand-deep-navy mb-5">
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
                        className="w-full px-4 py-2.5 bg-white border border-border-light rounded-lg text-sm text-foreground placeholder:text-foreground-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition"
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
