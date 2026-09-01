'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getVideoInfo } from '@/lib/video';
import { Play, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';

interface VideoEmbedCardProps {
  url: string;
  title: string;
  thumbnailUrl?: string | null;
  className?: string;
  autoPlayOnClick?: boolean;
}

export function VideoEmbedCard({
  url,
  title,
  thumbnailUrl,
  className = '',
  autoPlayOnClick = true,
}: VideoEmbedCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const info = getVideoInfo(url);
  const effectiveThumb = thumbnailUrl || info.thumbnailUrl;

  // If URL is invalid, or if iframe failed, or if no embed URL is possible:
  // Render the GOSEDMA Logo Fallback Frame!
  if (hasError || !info.embedUrl) {
    return (
      <div
        className={`aspect-video w-full bg-gradient-to-br from-brand-navy via-brand-deep-navy to-[#06152B] relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden ${className}`}
      >
        {/* Ambient background aura */}
        <div className="absolute w-44 h-44 rounded-full bg-brand-green/10 blur-2xl pointer-events-none" />

        {/* Circular Logo with Glowing Ring */}
        <div className="relative mb-3 group">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-brand-green to-emerald-400 opacity-30 blur-xs group-hover:opacity-50 transition" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-xl flex items-center justify-center overflow-hidden">
            <Image
              src="/images/logo-circular.png"
              alt="GOSEDMA Logo"
              width={76}
              height={76}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h4 className="text-white font-heading font-bold text-sm sm:text-base mb-1 line-clamp-1 max-w-sm">
          {title || 'GOSEDMA Training Video'}
        </h4>
        <p className="text-white/60 text-xs mb-3 max-w-xs line-clamp-1">
          {info.provider === 'youtube'
            ? 'Play directly on YouTube'
            : info.provider === 'googledrive'
            ? 'Stored on Google Drive'
            : 'Click link to view source video'}
        </p>

        <a
          href={info.sourceUrl || url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark transition shadow-md hover:scale-105"
        >
          <span>{info.provider === 'youtube' ? 'Watch on YouTube' : 'Open Video'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Active iframe player (when user clicks play or when initialized)
  if (isPlaying) {
    return (
      <div className={`aspect-video w-full bg-black relative overflow-hidden ${className}`}>
        <iframe
          src={`${info.embedUrl}${autoPlayOnClick ? (info.embedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1') : ''}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          onError={() => setHasError(true)}
        />
        {/* Subtle fallback trigger if YouTube still blocks connection on client */}
        <button
          type="button"
          onClick={() => setHasError(true)}
          title="Video not loading? Click to switch to Logo & direct link"
          className="absolute bottom-2 right-2 text-[10px] bg-black/80 hover:bg-black text-white/70 hover:text-white px-2 py-0.5 rounded shadow z-10 cursor-pointer"
        >
          Having issue? Switch to direct link
        </button>
      </div>
    );
  }

  // Click-to-Play Facade with Thumbnail / Logo & Play Button
  return (
    <div
      onClick={() => setIsPlaying(true)}
      className={`aspect-video w-full bg-black relative overflow-hidden cursor-pointer group select-none ${className}`}
    >
      {effectiveThumb ? (
        <img
          src={effectiveThumb}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-brand-navy via-brand-deep-navy to-[#06152B] flex flex-col items-center justify-center p-6 text-center relative">
          <div className="w-16 h-16 rounded-full bg-white p-1 shadow-lg mb-2 flex items-center justify-center">
            <Image
              src="/images/logo-circular.png"
              alt="GOSEDMA Logo"
              width={60}
              height={60}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors" />

      {/* Center Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-green/90 group-hover:bg-brand-green text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-200">
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
        </div>
      </div>

      {/* Provider badge */}
      <div className="absolute top-3 left-3">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow bg-black/80 text-white">
          {info.provider === 'googledrive' ? 'Google Drive' : 'YouTube'}
        </span>
      </div>
    </div>
  );
}
