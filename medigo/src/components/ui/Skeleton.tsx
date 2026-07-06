import type { CSSProperties } from 'react';

/* ─────────────── Base Skeleton ─────────────── */

type SkeletonRounded = 'sm' | 'md' | 'lg' | 'full';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: SkeletonRounded;
  className?: string;
}

const roundedMap: Record<SkeletonRounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

function Skeleton({
  width,
  height,
  rounded = 'md',
  className = '',
}: SkeletonProps) {
  const style: CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      aria-hidden="true"
      className={['skeleton', roundedMap[rounded], className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    />
  );
}

/* ─────────────── SkeletonText ─────────────── */

interface SkeletonTextProps {
  lines?: number;
  gap?: string;
  className?: string;
}

function SkeletonText({
  lines = 3,
  gap = 'gap-2.5',
  className = '',
}: SkeletonTextProps) {
  return (
    <div
      aria-hidden="true"
      className={['flex flex-col', gap, className].filter(Boolean).join(' ')}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded-md"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────── SkeletonCircle ─────────────── */

interface SkeletonCircleProps {
  size?: number;
  className?: string;
}

function SkeletonCircle({ size = 48, className = '' }: SkeletonCircleProps) {
  return (
    <div
      aria-hidden="true"
      className={['skeleton rounded-full shrink-0', className]
        .filter(Boolean)
        .join(' ')}
      style={{ width: size, height: size }}
    />
  );
}

/* ─────────────── SkeletonCard ─────────────── */

interface SkeletonCardProps {
  className?: string;
}

function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'rounded-2xl bg-surface border border-border-light p-6 space-y-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Skeleton width="40%" height={20} rounded="md" />
      <SkeletonText lines={3} />
      <Skeleton width="30%" height={36} rounded="lg" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard };
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonCircleProps,
  SkeletonCardProps,
  SkeletonRounded,
};
