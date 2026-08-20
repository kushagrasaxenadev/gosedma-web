import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for GOSEDMA — ${SITE_CONFIG.fullName}. How we collect, use, and protect your personal information.`,
};

export default function PrivacyPage() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <Badge variant="navy" className="mb-4">Legal</Badge>
        <h1 className="font-heading font-extrabold text-4xl text-brand-deep-navy mb-8">
          Privacy Policy
        </h1>
        <div className="space-y-8 text-foreground-secondary leading-relaxed">
          <p className="text-sm text-muted-foreground italic">
            This privacy policy template requires legal review before production use. Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">1. Information We Collect</h2>
            <p>When you interact with GOSEDMA ({SITE_CONFIG.fullName}), we may collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name and contact information (phone, email, WhatsApp)</li>
              <li>Enquiry details (programme interest, preferred branch, age group)</li>
              <li>Institution details (for workshop enquiries)</li>
              <li>Website usage data (anonymous analytics)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">2. How We Use Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Respond to trial class bookings and programme enquiries</li>
              <li>Process workshop requests from schools and institutions</li>
              <li>Provide information about our training programmes</li>
              <li>Improve our website and services</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">3. Data Protection</h2>
            <p>We take the protection of personal data seriously, especially data relating to minors. We do not publicly share personal information of students, particularly children.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">4. Media & Photos</h2>
            <p>Photos and videos involving minors are only published with explicit consent. Media publication requires administrative approval.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">5. Contact</h2>
            <p>For privacy-related enquiries, contact us at {SITE_CONFIG.email} or {SITE_CONFIG.phone}.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
