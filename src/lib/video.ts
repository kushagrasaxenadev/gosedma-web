/**
 * Universal Video Parser & Helper for GOSEDMA
 * Robustly parses YouTube, YouTube Shorts, Google Drive, and handles fallbacks.
 */

export interface VideoInfo {
  provider: 'youtube' | 'googledrive' | 'invalid';
  id: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  sourceUrl: string;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If directly an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/v\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  return null;
}

export function getVideoInfo(url: string): VideoInfo {
  if (!url) {
    return { provider: 'invalid', id: null, embedUrl: null, thumbnailUrl: null, sourceUrl: '' };
  }

  const trimmed = url.trim();

  // 1. YouTube
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      provider: 'youtube',
      id: ytId,
      // youtube-nocookie prevents tracking cookies & iframe refuse blocks
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      sourceUrl: `https://www.youtube.com/watch?v=${ytId}`,
    };
  }

  // 2. Google Drive
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return {
      provider: 'googledrive',
      id: driveId,
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      thumbnailUrl: null,
      sourceUrl: trimmed,
    };
  }

  // Invalid / non-embeddable format
  return {
    provider: 'invalid',
    id: null,
    embedUrl: null,
    thumbnailUrl: null,
    sourceUrl: trimmed,
  };
}
