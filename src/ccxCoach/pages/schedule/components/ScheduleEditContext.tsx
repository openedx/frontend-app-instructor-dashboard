import { createContext, useContext, useMemo, ReactNode } from 'react';
import { CategoryType } from '../types';

interface ScheduleEditContextValue {
  initiallyHidden: Set<string>;
  blockedByAncestorCategory: Map<string, CategoryType>;
}

const ScheduleEditContext = createContext<ScheduleEditContextValue | undefined>(undefined);

interface ScheduleEditProviderProps {
  initiallyHidden: Set<string>;
  blockedByAncestorCategory: Map<string, CategoryType>;
  children: ReactNode;
}

export const ScheduleEditProvider = ({ initiallyHidden, blockedByAncestorCategory, children }: ScheduleEditProviderProps) => {
  const value = useMemo(
    () => ({ initiallyHidden, blockedByAncestorCategory }),
    [initiallyHidden, blockedByAncestorCategory],
  );

  return (
    <ScheduleEditContext.Provider value={value}>
      {children}
    </ScheduleEditContext.Provider>
  );
};

export const useScheduleEdit = (): ScheduleEditContextValue => {
  const context = useContext(ScheduleEditContext);
  if (!context) {
    throw new Error('useScheduleEdit must be used within a ScheduleEditProvider');
  }
  return context;
};
