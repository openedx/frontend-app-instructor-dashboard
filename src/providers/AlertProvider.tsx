import { createContext, useContext, useState, ReactNode, useCallback, useMemo, FC } from 'react';
import { Toast, AlertModal, ActionRow, Button, Alert } from '@openedx/paragon';
import { WarningFilled, Error as ErrorIcon, Info as InfoIcon, CheckCircle } from '@openedx/paragon/icons';

// Toast Alert Types
interface ToastAlert {
  id: string;
  type: 'toast';
  message: string;
  visible: boolean;
  delay?: number;
}

// Modal Alert Types
interface ModalAlert {
  id: string;
  type: 'modal';
  title?: string;
  message: string;
  variant: 'default' | 'warning' | 'danger' | 'success';
  isOpen: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (id: string) => void;
  onCancel?: () => void;
}

export type AlertType = 'success' | 'error' | 'info' | 'warning' | 'danger';

export interface AlertProps {
  id: string;
  type: AlertType;
  message: string;
  extraContent?: ReactNode;
}

interface InlineAlert {
  id: string;
  type: 'inline';
  message: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  dismissible?: boolean;
}

interface AlertContextType {
  showToast: (message: string, delay?: number) => void;
  showModal: (options: {
    title?: string;
    message: string;
    variant?: 'default' | 'warning' | 'danger' | 'success';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: (id: string) => void;
    onCancel?: () => void;
  }) => void;
  showInlineAlert: (message: string, variant?: 'success' | 'danger' | 'warning' | 'info', dismissible?: boolean) => string;
  dismissInlineAlert: (id: string) => void;
  inlineAlerts: InlineAlert[];
  alerts: AlertProps[];
  addAlert: (alert: Omit<AlertProps, 'id'>) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

const variantIcons: Record<string, any> = {
  success: CheckCircle,
  error: ErrorIcon,
  warning: WarningFilled,
  info: InfoIcon,
  danger: ErrorIcon,
};

export const AlertProvider: FC<AlertProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const [modals, setModals] = useState<ModalAlert[]>([]);
  const [inlineAlerts, setInlineAlerts] = useState<InlineAlert[]>([]);
  const [alerts, setAlerts] = useState<AlertProps[]>([]); // PR #113 compatible state

  // Toast Methods
  const showToast = useCallback((message: string, delay?: number) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastAlert = { id, type: 'toast', message, visible: true, delay };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const discardToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, visible: false } : t)));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 500);
  }, []);

  // Modal Methods
  const showModal = useCallback((options: {
    title?: string;
    message: string;
    variant?: 'default' | 'warning' | 'danger' | 'success';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: (id: string) => void;
    onCancel?: () => void;
  }) => {
    const id = `modal-${Date.now()}-${Math.random()}`;
    const newModal: ModalAlert = {
      id,
      type: 'modal',
      title: options.title,
      message: options.message,
      variant: options.variant || 'default',
      isOpen: true,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    };
    setModals(prev => [...prev, newModal]);
  }, []);

  const closeModal = useCallback((id: string, callOnCancel?: boolean) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal && callOnCancel && modal.onCancel) {
        modal.onCancel();
      }
      return prev.filter(m => m.id !== id);
    });
  }, []);

  const confirmModal = useCallback((id: string) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal?.onConfirm) {
        modal.onConfirm(id);
      }
      return prev.filter(m => m.id !== id);
    });
  }, []);

  // Inline Alert Methods
  const showInlineAlert = useCallback((
    message: string,
    variant: 'success' | 'danger' | 'warning' | 'info' = 'info',
    dismissible = true
  ): string => {
    const id = `inline-${Date.now()}`;
    const newAlert: InlineAlert = { id, type: 'inline', message, variant, dismissible };
    setInlineAlerts(prev => [...prev, newAlert]);
    return id;
  }, []);

  const dismissInlineAlert = useCallback((id: string) => {
    setInlineAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const addAlert = useCallback((alert: Omit<AlertProps, 'id'>) => {
    const id = `alert-${Date.now()}-${Math.random()}`;
    const newAlert: AlertProps = { ...alert, id };
    setAlerts(prev => [...prev, newAlert]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setToasts([]);
    setModals([]);
    setInlineAlerts([]);
    setAlerts([]);
  }, []);

  const value = useMemo(() => ({
    showToast,
    showModal,
    showInlineAlert,
    dismissInlineAlert,
    clearAlerts,
    inlineAlerts,
    alerts,
    addAlert,
    removeAlert,
  }), [showToast, showModal, showInlineAlert, dismissInlineAlert, clearAlerts, inlineAlerts, alerts, addAlert, removeAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            show={toast.visible}
            onClose={() => discardToast(toast.id)}
            delay={toast.delay}
            className="text-break"
          >
            {toast.message}
          </Toast>
        ))}
      </div>

      {/* Modal Alerts - Only show the first modal in the queue */}
      {modals.length > 0 && (() => {
        const modal = modals[0];
        const icon = variantIcons[modal.variant];
        return (
          <AlertModal
            key={modal.id}
            title={modal.title}
            isOpen={modal.isOpen}
            onClose={() => closeModal(modal.id, true)}
            variant={modal.variant}
            {...(icon && { icon })}
            hasHeader={!!modal.title}
            footerNode={(
              <ActionRow>
                {modal.cancelText && (
                  <Button variant="tertiary" onClick={() => closeModal(modal.id, true)}>
                    {modal.cancelText}
                  </Button>
                )}
                {modal.confirmText && (
                  <Button
                    variant={modal.variant === 'danger' ? 'danger' : 'primary'}
                    onClick={() => modal.onConfirm ? confirmModal(modal.id) : closeModal(modal.id, false)}
                  >
                    {modal.confirmText}
                  </Button>
                )}
              </ActionRow>
            )}
          >
            <p>{modal.message}</p>
          </AlertModal>
        );
      })()}
    </AlertContext.Provider>
  );
};

export const AlertOutlet: FC = () => {
  const { alerts, removeAlert } = useAlert();

  return (
    <div className="alert-outlet">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          className="mt-3"
          icon={variantIcons[alert.type]}
          variant={alert.type === 'error' ? 'danger' : alert.type}
          dismissible
          onClose={() => removeAlert(alert.id)}
        >
          {alert.message}
          {alert.extraContent}
        </Alert>
      ))}
    </div>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
