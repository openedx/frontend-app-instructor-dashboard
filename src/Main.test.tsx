import { waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderWithIntl } from '@src/testUtils';
import Main from './Main';

jest.mock('./pageWrapper/PageWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Main', () => {
  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return renderWithIntl(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('sets the document title from the page-title message and site name', async () => {
    renderComponent();
    await waitFor(() => {
      expect(document.title).toBe('Instructor Dashboard | Instructor Test Site');
    });
  });
});
