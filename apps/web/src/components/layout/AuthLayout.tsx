import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-indigo-50/30 dark:to-indigo-950/20">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              IG
            </div>
            <span className="text-lg font-semibold">InterviewGPT</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
