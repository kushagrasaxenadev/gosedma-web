import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for GOSEDMA — ${SITE_CONFIG.fullName}. Terms governing use of our website and services.`,
};

export default function TermsPage() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <Badge variant="navy" className="mb-4">Legal</Badge>
        <h1 className="font-heading font-extrabold text-4xl text-brand-deep-navy mb-8">
          Terms of Service
        </h1>
        <div className="space-y-8 text-foreground-secondary leading-relaxed">
          <p className="text-sm text-muted-foreground italic">
            These terms require legal review before production use. Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">1. Use of Website</h2>
            <p>This website is operated by GOSEDMA ({SITE_CONFIG.fullName}). By using this website, you agree to these terms.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">2. Training Services</h2>
            <p>All training programmes are subject to availability. Schedules, fees, and programme details are subject to change. Contact the academy directly for the most current information.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">3. Enquiry Forms</h2>
            <p>Information submitted through enquiry forms is used solely for the purpose of responding to your request and providing relevant information about our services.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">4. Intellectual Property</h2>
            <p>The GOSEDMA name, logo, and website content are the property of the academy. Unauthorized use is prohibited.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">5. Contact</h2>
            <p>For questions about these terms, contact us at {SITE_CONFIG.email}.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
