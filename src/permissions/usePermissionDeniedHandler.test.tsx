import { renderHook } from '@testing-library/react';
import { useAlert } from '@src/providers/AlertProvider';
import { AlertAndIntlWrapper } from '@src/testUtils';
import { usePermissionDeniedHandler } from './usePermissionDeniedHandler';

const mockShowModal = jest.fn();

jest.mock('@src/providers/AlertProvider', () => {
  const actual = jest.requireActual('@src/providers/AlertProvider');
  return {
    ...actual,
    useAlert: jest.fn(),
  };
});

const mockUseAlert = useAlert as jest.MockedFunction<typeof useAlert>;

describe('usePermissionDeniedHandler', () => {
  beforeEach(() => {
    mockUseAlert.mockReturnValue({ showModal: mockShowModal } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows an error modal and returns true for a 403 response error', () => {
    const { result } = renderHook(() => usePermissionDeniedHandler(), { wrapper: AlertAndIntlWrapper });

    const handled = result.current({ response: { status: 403 } });

    expect(handled).toBe(true);
    expect(mockShowModal).toHaveBeenCalledTimes(1);
    expect(mockShowModal).toHaveBeenCalledWith({
      message: "You don't have permission to perform this action.",
      variant: 'danger',
      confirmText: 'Close',
    });
  });

  it('shows an error modal and returns true for a flat 403 status error', () => {
    const { result } = renderHook(() => usePermissionDeniedHandler(), { wrapper: AlertAndIntlWrapper });

    const handled = result.current({ status: 403 });

    expect(handled).toBe(true);
    expect(mockShowModal).toHaveBeenCalledTimes(1);
  });

  it('does not show a modal and returns false for a non-403 error', () => {
    const { result } = renderHook(() => usePermissionDeniedHandler(), { wrapper: AlertAndIntlWrapper });

    const handled = result.current({ response: { status: 500 } });

    expect(handled).toBe(false);
    expect(mockShowModal).not.toHaveBeenCalled();
  });

  it('does not show a modal and returns false for an undefined error', () => {
    const { result } = renderHook(() => usePermissionDeniedHandler(), { wrapper: AlertAndIntlWrapper });

    const handled = result.current(undefined);

    expect(handled).toBe(false);
    expect(mockShowModal).not.toHaveBeenCalled();
  });
});
