import { createContext, useContext, useState, ReactNode, useCallback, useMemo, FC } from 'react';
import { Skeleton } from '@openedx/paragon';
import AccessErrorAlert, { AccessErrorAlertType } from '@src/providers/AccessErrorAlert';

type ErrorType = AccessErrorAlertType | null;

interface AccessErrorContextType {
  errorType: ErrorType;
  setErrorType: (error: ErrorType) => void;
  clearError: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const AccessErrorContext = createContext<AccessErrorContextType | undefined>(undefined);

interface AccessErrorProviderProps {
  children: ReactNode;
}

export const AccessErrorProvider: FC<AccessErrorProviderProps> = ({ children }) => {
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isLoading, setLoading] = useState(false);

  const clearError = useCallback(() => {
    setErrorType(null);
  }, []);

  const value = useMemo(() => ({
    errorType,
    setErrorType,
    clearError,
    isLoading,
    setLoading,
  }), [errorType, clearError, isLoading]);

  return (
    <AccessErrorContext.Provider value={value}>
      {children}
    </AccessErrorContext.Provider>
  );
};

interface AccessErrorGuardProps {
  children: ReactNode;
}

export const AccessErrorGuard: FC<AccessErrorGuardProps> = ({ children }) => {
  const { errorType, isLoading } = useAccessError();

  if (isLoading) {
    return <Skeleton className="lead" />;
  }

  if (errorType) {
    return <AccessErrorAlert errorType={errorType} />;
  }

  return <>{children}</>;
};

export const useAccessError = (): AccessErrorContextType => {
  const context = useContext(AccessErrorContext);
  if (context === undefined) {
    throw new Error('useAccessError must be used within a AccessErrorProvider');
  }
  return context;
};
