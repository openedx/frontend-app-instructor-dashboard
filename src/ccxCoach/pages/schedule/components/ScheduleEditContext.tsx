import { createContext, useContext, useMemo, ReactNode } from 'react';

interface ScheduleEditContextValue {
  initiallyHidden: Set<string>;
}

const ScheduleEditContext = createContext<ScheduleEditContextValue | undefined>(undefined);

interface ScheduleEditProviderProps {
  initiallyHidden: Set<string>;
  children: ReactNode;
}

export const ScheduleEditProvider = ({ initiallyHidden, children }: ScheduleEditProviderProps) => {
  const value = useMemo(() => ({ initiallyHidden }), [initiallyHidden]);

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
