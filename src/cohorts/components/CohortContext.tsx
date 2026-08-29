import { createContext, useContext, useState, ReactNode, useCallback, FC, useMemo } from 'react';
import { CohortData } from '../types';

interface CohortContextType {
  selectedCohort: CohortData | null;
  setSelectedCohort: (cohort: CohortData) => void;
  clearSelectedCohort: () => void;
  updateCohortField: (field: keyof CohortData, value: string) => void;
}

const CohortContext = createContext<CohortContextType | undefined>(undefined);

interface CohortProviderProps {
  children: ReactNode;
}

const areCohortsEqual = (prev: CohortData | null, current: CohortData): boolean => {
  if (!prev) return false;
  return prev.id === current.id
    && prev.name === current.name
    && prev.assignmentType === current.assignmentType
    && prev.userPartitionId === current.userPartitionId
    && prev.userCount === current.userCount
    && prev.groupId === current.groupId;
};

export const CohortProvider: FC<CohortProviderProps> = ({ children }) => {
  const [selectedCohort, setSelectedCohortState] = useState<CohortData | null>(null);

  const setSelectedCohort = useCallback((cohort: CohortData) => {
    setSelectedCohortState(prev => {
      // Only update if the values actually changed
      if (!areCohortsEqual(prev, cohort)) {
        return cohort;
      }
      return prev;
    });
  }, []);

  const clearSelectedCohort = useCallback(() => {
    setSelectedCohortState(null);
  }, []);

  const updateCohortField = useCallback((field: keyof CohortData, value: string) => {
    setSelectedCohortState(prev =>
      prev ? { ...prev, [field]: value } : null
    );
  }, []);

  const value = useMemo(() => ({
    selectedCohort,
    setSelectedCohort,
    clearSelectedCohort,
    updateCohortField
  }), [selectedCohort, setSelectedCohort, clearSelectedCohort, updateCohortField]);

  return (
    <CohortContext.Provider value={value}>
      {children}
    </CohortContext.Provider>
  );
};

export const useCohortContext = (): CohortContextType => {
  const context = useContext(CohortContext);
  if (context === undefined) {
    throw new Error('useCohortContext must be used within a CohortProvider');
  }
  return context;
};
