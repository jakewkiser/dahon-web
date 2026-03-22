// client/src/components/ui/Skeleton.tsx
// Shimmer skeleton blocks for loading states.

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[var(--surface-alt)] ${className}`}
    />
  )
}

export function PlantCardSkeleton() {
  return (
    <div className="rounded-xl p-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-[var(--shadow-soft)]">
      <Skeleton className="w-full h-40 mb-3 rounded-xl" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <Skeleton className="h-5 w-28 rounded-lg" />
    </div>
  )
}

export function PlantDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="w-full h-60 rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-40 mb-1" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default Skeleton
