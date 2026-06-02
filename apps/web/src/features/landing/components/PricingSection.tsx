import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { PRICING_PLANS, PRICING_COMPARISON } from '../data/landing-content';
import { cn } from '@/lib/utils';

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Pricing"
          title="Plans that grow with your ambition"
          description="Start free. Upgrade when you're serious about product companies."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative flex flex-col rounded-2xl border p-8',
                plan.highlighted
                  ? 'border-primary bg-gradient-to-b from-primary/10 to-transparent shadow-xl shadow-primary/10'
                  : 'border-border/60 bg-card/50',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn('mt-8 w-full', plan.highlighted && 'shadow-lg shadow-primary/25')}
                variant={plan.highlighted ? 'default' : 'outline'}
                size="lg"
                asChild
              >
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-2xl border border-border/60"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 font-medium">Feature</th>
                  <th className="px-6 py-4 font-medium text-center">Free</th>
                  <th className="px-6 py-4 font-medium text-center">Pro</th>
                  <th className="px-6 py-4 font-medium text-center">Ultimate</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-border/50 last:border-0">
                    <td className="px-6 py-4">{row.feature}</td>
                    {(['free', 'pro', 'ultimate'] as const).map((tier) => {
                      const value = row[tier];
                      return (
                        <td key={tier} className="px-6 py-4 text-center">
                          {value === true ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-500" />
                          ) : value === false ? (
                            <X className="mx-auto h-4 w-4 text-muted-foreground/50" />
                          ) : (
                            <span className="text-muted-foreground">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
