import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInput } from '@interviewgpt/shared';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import * as authApi from '../api/auth.api';
import { ApiClientError } from '@/lib/api-client';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setError(null);
    try {
      await authApi.resetPassword({ ...data, token: data.token || token });
      navigate('/login', { replace: true, state: { message: 'Password updated. Please sign in.' } });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Reset failed');
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This password reset link is invalid or expired">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Request a new reset link from the forgot password page.
            </p>
            <Link to="/forgot-password" className="mt-4 inline-block text-sm text-primary hover:underline">
              Forgot password
            </Link>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset password" subtitle="Enter your new password">
      <Card>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('token')} />

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
