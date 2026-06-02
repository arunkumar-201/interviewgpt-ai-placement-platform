import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refetchUser } = useAuth();

  useEffect(() => {
    const success = searchParams.get('success');

    async function handleCallback() {
      if (success === 'true') {
        await refetchUser();
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login?error=oauth_failed', { replace: true });
      }
    }

    handleCallback();
  }, [navigate, refetchUser, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
