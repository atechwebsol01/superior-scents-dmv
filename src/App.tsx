import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from '@/routes';
import { ErrorBoundary, ConfirmProvider } from '@/components';

/**
 * Superior Scents DMV, LLC
 * Business Management System
 */
function App() {
  return (
    <ErrorBoundary>
      <ConfirmProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-neutral-900)',
              color: '#fff',
              borderRadius: '0.5rem',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </ConfirmProvider>
    </ErrorBoundary>
  );
}

export default App;
