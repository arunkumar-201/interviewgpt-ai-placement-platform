import { Link } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

export function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const testAdminPing = async () => {
    try {
      const result = await apiClient<{ message: string }>('/admin/ping');
      alert(result.message);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Admin ping failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              IG
            </div>
            InterviewGPT
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name}</CardTitle>
            <CardDescription>
              Phase 2 authentication is active. Full dashboard arrives in Phase 4.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 text-sm">
              <p>
                <span className="text-muted-foreground">Email:</span> {user?.email}
              </p>
              <p>
                <span className="text-muted-foreground">Role:</span>{' '}
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {user?.role}
                </span>
              </p>
            </div>

            {isAdmin && (
              <Button variant="outline" size="sm" onClick={testAdminPing}>
                <Shield className="h-4 w-4" />
                Test Admin RBAC
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
