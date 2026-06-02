import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FOOTER_LINKS } from '../data/landing-content';

export function LandingFooter() {
  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-8 text-center sm:p-12"
        >
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to become placement ready?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Join thousands of students using InterviewGPT to land offers at top companies.
          </p>
          <Button size="lg" className="mt-6 shadow-lg shadow-primary/25" asChild>
            <Link to="/register">
              Get Started Free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-sm font-bold text-white">
                IG
              </div>
              <span className="font-semibold">InterviewGPT</span>
            </Link>
            <p id="about" className="mt-4 text-sm text-muted-foreground scroll-mt-24">
              AI-powered placement preparation platform for students targeting FAANG, product, and
              service companies.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('mailto') ? (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    id={link.href.replace('#', '')}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground scroll-mt-24"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} InterviewGPT. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Built for placement season 🚀</p>
        </div>
      </div>
    </footer>
  );
}
