import { ReactNode, useState } from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { AlertProvider } from './providers/AlertProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

/**
 * Shared `renderHook` / `render` wrappers. Pass them as `{ wrapper }` so the
 * providers also survive `rerender`, which re-wraps the UI automatically.
 */
export const IntlWrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>{children}</IntlProvider>
);

export const AlertAndIntlWrapper = ({ children }: { children: ReactNode }) => (
  <IntlWrapper>
    <AlertProvider>{children}</AlertProvider>
  </IntlWrapper>
);

/**
 * Creates a fresh QueryClient per mount (so the cache never leaks between tests)
 * and keeps it stable across rerenders. Retries are off so failures surface at once.
 */
export const QueryClientWrapper = ({ children }: { children: ReactNode }) => {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export const renderWithQueryClient = (ui: React.ReactElement) =>
  renderWithAlertAndIntl(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );

export const renderWithIntl = (component) => {
  return render(component, { wrapper: IntlWrapper });
};

export const renderWithAlertAndIntl = (component) => {
  return render(component, { wrapper: AlertAndIntlWrapper });
};

export const createQueryMock = (data: any = undefined, isLoading = false) => ({
  data,
  isLoading,
  error: null,
  isError: false,
  isSuccess: !isLoading && data !== undefined,
  status: isLoading ? 'loading' : data ? 'success' : 'idle',
  fetchStatus: isLoading ? 'fetching' : 'idle',
  refetch: jest.fn(),
} as any);
