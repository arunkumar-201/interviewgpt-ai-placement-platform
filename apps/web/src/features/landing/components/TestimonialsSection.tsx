import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { TESTIMONIALS } from '../data/landing-content';

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 dark:bg-muted/10 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Success Stories"
          title="Students who cracked their dream offers"
          description="Real outcomes from candidates who used InterviewGPT for placement season."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm sm:p-8"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />

              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-base leading-relaxed text-foreground/90">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <footer className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-sm font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm font-medium text-primary">{testimonial.company}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
