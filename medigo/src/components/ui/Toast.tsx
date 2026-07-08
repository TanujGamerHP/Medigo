'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

/* ─────────────── Types ─────────────── */

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => void;
  addToast: (options: { type: ToastType; message: string; duration?: number }) => void;
}

/* ─────────────── Context ─────────────── */

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

/* ─────────────── Icon map ─────────────── */

const iconMap: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={20} className="shrink-0 text-primary" />,
  error: <XCircle size={20} className="shrink-0 text-error" />,
  warning: <AlertTriangle size={20} className="shrink-0 text-warning" />,
  info: <Info size={20} className="shrink-0 text-info" />,
};

const barColorMap: Record<ToastType, string> = {
  success: 'bg-primary',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-info',
};

/* ─────────────── Individual Toast ─────────────── */

interface SingleToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function SingleToast({ toast, onDismiss }: SingleToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Slide in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  // Auto-dismiss
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleClose();
    }, toast.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.duration, toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={[
        'relative flex items-start gap-3 w-80 bg-surface shadow-lg rounded-xl px-4 pt-4 pb-5 border border-border-light overflow-hidden',
        'transition-all duration-300 ease-out',
        visible && !exiting
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-full',
      ].join(' ')}
    >
      {iconMap[toast.type]}

      <p className="flex-1 text-sm text-text-primary leading-snug pt-0.5">
        {toast.message}
      </p>

      <button
        onClick={handleClose}
        className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X size={16} />
      </button>

      {/* Progress bar */}
      <span
        className={[
          'absolute bottom-0 left-0 h-1 rounded-full',
          barColorMap[toast.type],
        ].join(' ')}
        style={{
          animation: `toast-progress ${toast.duration}ms linear forwards`,
        }}
      />

      {/* Inline keyframes for progress bar */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────── Provider ─────────────── */

let counter = 0;

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (message: string, type: ToastType = 'info', duration = 5000) => {
      const id = `toast-${++counter}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    },
    [],
  );

  const addToast = useCallback(
    (options: { type: ToastType; message: string; duration?: number }) => {
      show(options.message, options.type, options.duration);
    },
    [show],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, addToast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[500] flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <SingleToast toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ─────────────── Toast display component (for standalone use) ─────────────── */

interface ToastProps {
  type?: ToastType;
  message: string;
  onClose?: () => void;
}

function Toast({ type = 'info', message, onClose }: ToastProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 w-80 bg-surface shadow-lg rounded-xl px-4 py-3 border border-border-light"
    >
      {iconMap[type]}
      <p className="flex-1 text-sm text-text-primary leading-snug pt-0.5">
        {message}
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export { Toast, ToastProvider, useToast };
export type { ToastProps, ToastType, ToastItem };
