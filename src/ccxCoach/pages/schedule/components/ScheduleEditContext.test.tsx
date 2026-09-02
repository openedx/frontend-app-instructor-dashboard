import { renderHook } from '@testing-library/react';
import { ScheduleEditProvider, useScheduleEdit } from '@src/ccxCoach/pages/schedule/components/ScheduleEditContext';
import { CategoryType } from '@src/ccxCoach/pages/schedule/types';

describe('ScheduleEditContext', () => {
  it('provides initiallyHidden and blockedByAncestorCategory through the provider', () => {
    const initiallyHidden = new Set(['loc-1', 'loc-2']);
    const blockedByAncestorCategory = new Map<string, CategoryType>([['loc-3', 'sequential']]);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ScheduleEditProvider initiallyHidden={initiallyHidden} blockedByAncestorCategory={blockedByAncestorCategory}>
        {children}
      </ScheduleEditProvider>
    );

    const { result } = renderHook(() => useScheduleEdit(), { wrapper });

    expect(result.current.initiallyHidden).toBe(initiallyHidden);
    expect(result.current.blockedByAncestorCategory).toBe(blockedByAncestorCategory);
  });

  it('throws when useScheduleEdit is used outside a provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useScheduleEdit())).toThrow(
      'useScheduleEdit must be used within a ScheduleEditProvider',
    );

    consoleErrorSpy.mockRestore();
  });
});
