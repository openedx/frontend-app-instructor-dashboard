import { renderHook } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { AlertProvider, useAlert } from '@src/providers/AlertProvider';
import { usePermissionDeniedHandler } from './usePermissionDeniedHandler';

const mockShowToast = jest.fn();

jest.mock('@src/providers/AlertProvider', () => {
  const actual = jest.requireActual('@src/providers/AlertProvider');
  return {
    ...actual,
    useAlert: jest.fn(),
  };
});

const mockUseAlert = useAlert as jest.MockedFunction<typeof useAlert>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    <AlertProvider>{children}</AlertProvider>
  </IntlProvider>
);

describe('usePermissionDeniedHandler', () => {
  beforeEach(() => {
    mockUseAlert.mockReturnValue({ showToast: mockShowToast } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a toast and returns true for a 403 response error', () => {
    const { result } = renderHook(() => usePermissionDeniedHandler(), { wrapper });

    const handled = result.current({ response: { status: 403 } });

    expect(handled).toBe(true);
    expect(mockShowToast).toHaveBeenCalledTimes(1);
    expect(mockShowToast).toHaveBeenCalledWith("You don't have permission to perform this action.");
  });

  it('shows a toast and returns true for a flat 403 status error', () => {
    const { result } = renderHook(() => usePermissionDeniedHandler(), { wrapper });

    const handled = result.current({ status: 403 });

    expect(handled).toBe(true);
    expect(mockShowToast).toHaveBeenCalledTimes(1);
  });

  it('does not toast and returns false for a non-403 error', () => {
    const { result } = renderHook(() => usePermissionDeniedHandler(), { wrapper });

    const handled = result.current({ response: { status: 500 } });

    expect(handled).toBe(false);
    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it('does not toast and returns false for an undefined error', () => {
    const { result } = renderHook(() => usePermissionDeniedHandler(), { wrapper });

    const handled = result.current(undefined);

    expect(handled).toBe(false);
    expect(mockShowToast).not.toHaveBeenCalled();
  });
});
