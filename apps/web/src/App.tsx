import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { queryClient } from '@/lib/query-client';
import { HomePage } from '@/pages/HomePage';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AppProviders>
  );
}
