import { createContext, useContext, useState, ReactNode, useCallback, useMemo, FC } from 'react';
import { Alert, Skeleton } from '@openedx/paragon';
import { Error as ErrorIcon } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/providers/messages';

type ErrorType = 'forbidden' | 'unauthorized' | 'generic' | null;

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
  const intl = useIntl();
  const { errorType, isLoading } = useAccessError();

  if (isLoading) {
    return <Skeleton className="lead" />;
  }

  if (errorType) {
    const headingMap = {
      unauthorized: messages.unauthorizedErrorHeading,
      forbidden: messages.forbiddenErrorHeading,
      generic: messages.genericErrorHeading,
    };
    const messageMap = {
      unauthorized: messages.unauthorizedErrorMessage,
      forbidden: messages.forbiddenErrorMessage,
      generic: messages.genericErrorMessage,
    };

    return (
      <Alert
        variant="danger"
        icon={ErrorIcon}
      >
        <Alert.Heading>{intl.formatMessage(headingMap[errorType])}</Alert.Heading>
        <p>
          {intl.formatMessage(messageMap[errorType])}
        </p>
      </Alert>
    );
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
