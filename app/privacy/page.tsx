import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background-elevated">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Immigration Letter Generator
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card>
          <CardHeader
            title="Privacy Policy"
            description="Last updated: January 26, 2026"
          />
          <CardContent>
            <div className="prose prose-invert max-w-none space-y-6 text-foreground-muted">
              <section>
                <h3 className="text-foreground font-semibold mb-3">What We Collect</h3>
                <p>We collect the information you provide in the form (name, citizenship, application details, and explanation text) to generate your immigration letter.</p>
                <p>Payment information is processed securely by Stripe. We never see or store your credit card details.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">How We Use Your Data</h3>
                <p>Your information is used solely to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Generate your immigration letter using AI</li>
                  <li>Process your payment through Stripe</li>
                  <li>Provide you with your purchased document</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Data Retention</h3>
                <p>Your form data and generated letter are stored temporarily in server memory for 24 hours to allow you to complete your purchase and download. After 24 hours, all data is automatically deleted.</p>
                <p>We do not maintain long-term storage of your personal information or immigration details.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Data Sharing</h3>
                <p>We do not sell, rent, or share your personal information with third parties, except:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Stripe (for payment processing)</li>
                  <li>OpenAI or Anthropic (for AI letter generation - data is not stored by these providers per their policies)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Security</h3>
                <p>We use industry-standard security measures including HTTPS encryption, secure payment processing through Stripe, and limited data retention.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Your Rights</h3>
                <p>Since we automatically delete your data after 24 hours, there is minimal data to manage. If you have concerns before the 24-hour period expires, contact us at the email below.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Contact</h3>
                <p>For privacy questions, email: <a href="mailto:support@example.com" className="text-accent-purple hover:underline">support@example.com</a></p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
