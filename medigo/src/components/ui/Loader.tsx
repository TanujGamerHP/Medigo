import { Loader2 } from 'lucide-react';

/* ─────────────── Spinner Loader ─────────────── */

interface LoaderProps {
  size?: number;
  className?: string;
}

function Loader({ size = 24, className = '' }: LoaderProps) {
  return (
    <Loader2
      size={size}
      className={['animate-spin text-primary', className]
        .filter(Boolean)
        .join(' ')}
      aria-label="Loading"
    />
  );
}

/* ─────────────── Dots Loader ─────────────── */

interface DotsLoaderProps {
  size?: number;
  className?: string;
}

function DotsLoader({ size = 8, className = '' }: DotsLoaderProps) {
  return (
    <div
      className={['inline-flex items-center gap-1.5', className]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full bg-primary"
          style={{
            width: size,
            height: size,
            animation: `dots-bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
          }}
        />
      ))}

      <style>{`
        @keyframes dots-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────── Page Loader ─────────────── */

interface PageLoaderProps {
  text?: string;
}

function PageLoader({ text = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader size={40} />
      <p className="mt-4 text-sm text-text-secondary font-medium">{text}</p>
    </div>
  );
}

export { Loader, DotsLoader, PageLoader };
export type { LoaderProps, DotsLoaderProps, PageLoaderProps };
