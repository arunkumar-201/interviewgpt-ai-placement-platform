import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@interviewgpt/shared';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import * as authApi from '../api/auth.api';
import { ApiClientError } from '@/lib/api-client';

export function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    try {
      await authApi.forgotPassword(data);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Request failed');
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We'll send you a link to reset your password"
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <p className="text-sm text-muted-foreground">
                If an account exists with that email, a reset link has been sent. Check your
                terminal logs in development mode.
              </p>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@college.edu"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
