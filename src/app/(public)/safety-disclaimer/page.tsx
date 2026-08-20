import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Safety Disclaimer',
  description: `Safety disclaimer for GOSEDMA — ${SITE_CONFIG.fullName}. Important safety information regarding martial arts and self-defence training.`,
};

export default function SafetyDisclaimerPage() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <Badge variant="warning" className="mb-4">Important</Badge>
        <h1 className="font-heading font-extrabold text-4xl text-brand-deep-navy mb-8">
          Safety Disclaimer
        </h1>
        <div className="space-y-8 text-foreground-secondary leading-relaxed">
          <p className="text-sm text-muted-foreground italic">
            This disclaimer requires legal review before production use.
          </p>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">Physical Activity Risk</h2>
            <p>Martial arts and self-defence training involve physical activity that carries inherent risks of injury. By participating in any GOSEDMA programme, you acknowledge these risks and agree to follow all safety instructions provided by our instructors.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">Medical Clearance</h2>
            <p>We recommend consulting a medical professional before beginning any physical training programme, especially if you have pre-existing medical conditions, injuries, or health concerns.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">Minors</h2>
            <p>Training for minors requires the consent and awareness of a parent or legal guardian. Parents/guardians are responsible for informing the academy of any medical conditions or special requirements.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">Responsible Use of Training</h2>
            <p>Self-defence techniques taught at GOSEDMA are for personal safety purposes only. GOSEDMA does not encourage or condone the use of martial arts techniques for aggression or unprovoked violence.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-brand-deep-navy mb-3">Contact</h2>
            <p>For safety-related concerns, contact us at {SITE_CONFIG.email} or {SITE_CONFIG.phone}.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
