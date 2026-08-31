import { renderHook } from '@testing-library/react';
import { ScheduleEditProvider, useScheduleEdit } from '@src/ccxCoach/pages/schedule/components/ScheduleEditContext';

describe('ScheduleEditContext', () => {
  it('provides initiallyHidden through the provider', () => {
    const initiallyHidden = new Set(['loc-1', 'loc-2']);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ScheduleEditProvider initiallyHidden={initiallyHidden}>{children}</ScheduleEditProvider>
    );

    const { result } = renderHook(() => useScheduleEdit(), { wrapper });

    expect(result.current.initiallyHidden).toBe(initiallyHidden);
  });

  it('throws when useScheduleEdit is used outside a provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useScheduleEdit())).toThrow(
      'useScheduleEdit must be used within a ScheduleEditProvider',
    );

    consoleErrorSpy.mockRestore();
  });
});
