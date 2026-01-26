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
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground-muted">
                [Privacy policy content to be added]
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
