import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { HOW_IT_WORKS } from '../data/landing-content';

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 dark:bg-muted/10 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="How It Works"
          title="From signup to offer letter in 5 steps"
          description="A structured path designed for campus and off-campus placement seasons."
        />

        <div className="relative">
          <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-primary via-violet-500/50 to-transparent md:left-1/2 md:block md:-translate-x-px" />

          <div className="space-y-8 md:space-y-12">
            {HOW_IT_WORKS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col gap-6 md:flex-row md:items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-sm font-medium text-primary">Step {step.step}</span>
                  <h3 className="mt-1 text-xl font-semibold sm:text-2xl">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>

                <div className="relative z-10 flex shrink-0 justify-center md:w-16">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/30 bg-background shadow-lg shadow-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
