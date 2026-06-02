import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Server, XCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchHealth, fetchReady } from '@/lib/api-client';

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className="text-muted-foreground">{label}</span>
      <span className={ok ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
        {ok ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}

export function HomePage() {
  const { isAuthenticated } = useAuth();

  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  const readyQuery = useQuery({
    queryKey: ['ready'],
    queryFn: fetchReady,
    retry: false,
  });

  const isLoading = healthQuery.isLoading || readyQuery.isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-indigo-50/40 dark:to-indigo-950/20">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              IG
            </div>
            <span className="text-lg font-semibold tracking-tight">InterviewGPT</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            <Server className="h-3.5 w-3.5" />
            Phase 1 — Project Foundation
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI Placement Preparation
            <span className="block text-primary">Platform</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Master DSA, interviews, resumes, and GitHub — all in one premium SaaS experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-12 max-w-lg"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                System Status
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </CardTitle>
              <CardDescription>Live connection check to API, PostgreSQL, and Redis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatusBadge ok={healthQuery.isSuccess} label="API" />
              <StatusBadge
                ok={readyQuery.data?.db === 'connected'}
                label="PostgreSQL"
              />
              <StatusBadge
                ok={readyQuery.data?.redis === 'connected'}
                label="Redis"
              />
              {healthQuery.data && (
                <p className="pt-2 text-xs text-muted-foreground">
                  Last checked: {new Date(healthQuery.data.timestamp).toLocaleString()}
                </p>
              )}
              {(healthQuery.isError || readyQuery.isError) && (
                <p className="text-sm text-red-600">
                  Start the API and run{' '}
                  <code className="rounded bg-muted px-1 py-0.5">docker compose up -d postgres redis</code>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
