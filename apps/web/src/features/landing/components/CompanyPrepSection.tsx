import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from './SectionHeader';
import { COMPANY_CARDS } from '../data/landing-content';
import { cn } from '@/lib/utils';

export function CompanyPrepSection() {
  return (
    <section id="companies" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Company Prep"
          title="Prepare for the companies you dream about"
          description="Curated question banks, difficulty insights, and readiness scores for top recruiters."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMPANY_CARDS.map((company, index) => (
            <motion.div
              key={company.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-lg"
            >
              <div
                className={cn(
                  'absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80',
                  company.accent,
                )}
              />

              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{company.name}</h3>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">{company.questions}+</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge variant="outline" className="text-xs">
                    {company.difficulty}
                  </Badge>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Readiness</span>
                    <span className="font-medium text-primary">{company.readinessScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${company.readinessScore}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={cn('h-full rounded-full bg-gradient-to-r', company.accent)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/register">
              Unlock all company banks
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
