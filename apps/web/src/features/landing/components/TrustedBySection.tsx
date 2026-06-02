import { motion } from 'framer-motion';
import { TRUSTED_COMPANIES } from '../data/landing-content';

export function TrustedBySection() {
  return (
    <section className="border-y border-border/50 bg-muted/30 py-12 dark:bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by students targeting
        </p>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-border/50 bg-card/50 px-6 py-3 backdrop-blur-sm"
              >
                <span className="whitespace-nowrap text-sm font-semibold">{company.name}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {company.category}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
