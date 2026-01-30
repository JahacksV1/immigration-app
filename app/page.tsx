'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

/**
 * Homepage / Landing Page
 * Conversion-optimized immigration letter generator landing
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background-elevated/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Immigration Letter Generator
          </h1>
          <Link href="/start">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-7xl font-bold text-foreground tracking-tight leading-tight">
              Generate an Immigration{' '}
              <span className="bg-gradient-to-r from-accent-purple via-accent-purple-glow to-accent-purple bg-clip-text text-transparent">
                Letter of Explanation
              </span>{' '}
              in Minutes
            </h2>
            <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
              Drafted from your information. Editable. Not legal advice.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/start">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                Start My Letter
              </Button>
            </Link>
            <Link href="/examples">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                View Examples
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-foreground-muted">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Account Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h3>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Three simple steps to your professionally drafted letter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-bl-full" />
            <CardContent className="pt-12 pb-8 relative">
              <div className="w-12 h-12 rounded-lg bg-accent-purple/20 flex items-center justify-center mb-6 shadow-glow">
                <span className="text-2xl font-bold text-accent-purple">1</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">
                Answer a Few Questions
              </h4>
              <p className="text-foreground-muted leading-relaxed">
                Tell us about your situation, application type, and what needs to be explained. Takes 5-10 minutes.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-bl-full" />
            <CardContent className="pt-12 pb-8 relative">
              <div className="w-12 h-12 rounded-lg bg-accent-purple/20 flex items-center justify-center mb-6 shadow-glow">
                <span className="text-2xl font-bold text-accent-purple">2</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">
                Review Your Drafted Letter
              </h4>
              <p className="text-foreground-muted leading-relaxed">
                AI generates a professional letter from your information. Preview before purchase.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-bl-full" />
            <CardContent className="pt-12 pb-8 relative">
              <div className="w-12 h-12 rounded-lg bg-accent-purple/20 flex items-center justify-center mb-6 shadow-glow">
                <span className="text-2xl font-bold text-accent-purple">3</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">
                Edit, Download, and Submit
              </h4>
              <p className="text-foreground-muted leading-relaxed">
                Make any changes you need, download as PDF, and submit with your application.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust & Disclaimer */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <Card className="border-accent-purple/20 bg-card/50">
          <CardContent className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  What This Is
                </h4>
                <ul className="space-y-2 text-foreground-muted">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-accent-purple mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>AI-generated draft based on your input</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-accent-purple mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Fully editable by you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-accent-purple mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Stripe payment</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  What This Is Not
                </h4>
                <ul className="space-y-2 text-foreground-muted">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Legal advice from an attorney</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Eligibility determination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Official government service</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <Card className="bg-gradient-to-br from-accent-purple/10 via-background to-background border-accent-purple/30 shadow-glow">
          <CardContent className="py-12 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-foreground-muted mb-8 max-w-2xl mx-auto">
              Generate your immigration letter in the next 10 minutes
            </p>
            <Link href="/start">
              <Button variant="primary" size="lg" className="min-w-[240px]">
                Start My Letter Now
              </Button>
            </Link>
            <p className="text-sm text-foreground-muted mt-6">
              One-time payment · Secure checkout · Instant access
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background-elevated mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <p className="text-sm text-foreground-muted">
              This service provides document drafting assistance only. Not legal advice.
              <br />
              Consult an immigration attorney for legal guidance.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground-muted">
              © 2026 Immigration Letter Generator
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:immigrationexplanationletter@gmail.com" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
