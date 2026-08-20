import type { Metadata } from 'next';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'GOSEDMA gallery — photos from training sessions, competitions, workshops, and academy events.',
};

export default function GalleryPage() {
  const images = [
    { src: '/images/gallery/training-session.png', alt: 'GOSEDMA training session — students practicing kicks', span: 'col-span-2 row-span-2' },
    { src: '/images/gallery/training-facility.png', alt: 'GOSEDMA training facility with equipment', span: '' },
    { src: '/images/gallery/academy-collage.jpg', alt: 'GOSEDMA events and achievements collage', span: '' },
  ];

  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              Gallery
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              Inside GOSEDMA
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Photos from our training sessions, competitions, workshops, and events.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.src} className={`rounded-xl overflow-hidden shadow-md ${img.span}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-foreground-secondary">
              More photos will be added as gallery albums are published through the admin CMS.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
