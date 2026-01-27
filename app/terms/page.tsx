import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';

export default function TermsPage() {
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
            title="Terms of Service"
            description="Last updated: January 26, 2026"
          />
          <CardContent>
            <div className="prose prose-invert max-w-none space-y-6 text-foreground-muted">
              <section>
                <h3 className="text-foreground font-semibold mb-3">Service Description</h3>
                <p>Immigration Letter Generator is a document drafting tool that uses artificial intelligence to help you create a Letter of Explanation for immigration applications based on information you provide.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">What This Service Is NOT</h3>
                <p className="font-semibold text-foreground">This service does not provide legal advice.</p>
                <p>We are not attorneys, and this tool does not:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Constitute legal advice or legal representation</li>
                  <li>Create an attorney-client relationship</li>
                  <li>Guarantee approval of your immigration application</li>
                  <li>Determine your eligibility for any immigration benefit</li>
                  <li>Replace consultation with a qualified immigration attorney</li>
                </ul>
                <p className="mt-3">For legal guidance on your immigration matter, consult a licensed immigration attorney.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Your Responsibilities</h3>
                <p>You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Providing accurate and truthful information</li>
                  <li>Reviewing the generated letter carefully</li>
                  <li>Making any necessary edits before using the letter</li>
                  <li>Ensuring the letter meets your specific needs</li>
                  <li>Consulting with an attorney if you have legal questions</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Payment Terms</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>One-time payment of $49 USD</li>
                  <li>No subscription or recurring charges</li>
                  <li>Payment processed securely through Stripe</li>
                  <li>Refunds: Due to the immediate delivery of a digital product, all sales are final once you download your letter</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Ownership and Use</h3>
                <p>Once purchased, the letter is yours to use, edit, and submit with your immigration application. You retain full ownership of your letter.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">No Guarantees</h3>
                <p>We make no guarantees, warranties, or representations about:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>The outcome of your immigration application</li>
                  <li>The suitability of the letter for your specific situation</li>
                  <li>Immigration law or policy</li>
                </ul>
                <p className="mt-3">Immigration decisions are made solely by government authorities based on their criteria and policies.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Limitation of Liability</h3>
                <p>To the maximum extent permitted by law, Immigration Letter Generator shall not be liable for any indirect, incidental, special, or consequential damages related to your use of this service or the generated letter.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Indemnification</h3>
                <p>You agree to indemnify and hold harmless Immigration Letter Generator from any claims, damages, or expenses arising from your use of the service or the letter in your immigration application.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Changes to Terms</h3>
                <p>We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
              </section>

              <section>
                <h3 className="text-foreground font-semibold mb-3">Contact</h3>
                <p>Questions about these terms? Email: <a href="mailto:support@example.com" className="text-accent-purple hover:underline">support@example.com</a></p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
