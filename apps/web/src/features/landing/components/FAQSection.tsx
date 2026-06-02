import { SectionHeader } from './SectionHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ_ITEMS } from '../data/landing-content';

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-24 bg-muted/30 py-20 dark:bg-muted/10 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know before starting your placement journey."
        />

        <Accordion type="single" collapsible className="w-full rounded-2xl border border-border/60 bg-card/50 px-6 backdrop-blur-sm">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
