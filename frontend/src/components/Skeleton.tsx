interface Props {
  variant?: 'home' | 'entry' | 'form' | 'search' | 'auth'
}

export default function Skeleton({ variant = 'home' }: Props) {
  return (
    <div className="skeleton-page">
      {variant === 'home' && <HomeSkeleton />}
      {variant === 'entry' && <EntrySkeleton />}
      {variant === 'form' && <FormSkeleton />}
      {variant === 'search' && <SearchSkeleton />}
      {variant === 'auth' && <AuthSkeleton />}
    </div>
  )
}

function SkeletonBlock({ width = '100%', height = '1rem' }: { width?: string; height?: string }) {
  return <div className="skeleton-block" style={{ width, height }} />
}

function HomeSkeleton() {
  return (
    <div>
      <SkeletonBlock width="200px" height="2rem" />
      <div className="skeleton-spacer" />
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonBlock key={i} width={`${60 + Math.random() * 30}%`} height="1.2rem" />
      ))}
    </div>
  )
}

function EntrySkeleton() {
  return (
    <div>
      <div className="skeleton-actions">
        <SkeletonBlock width="60px" height="2rem" />
        <SkeletonBlock width="70px" height="2rem" />
      </div>
      <SkeletonBlock width="60%" height="2.5rem" />
      <div className="skeleton-spacer" />
      <SkeletonBlock width="100%" height="1rem" />
      <SkeletonBlock width="100%" height="1rem" />
      <SkeletonBlock width="85%" height="1rem" />
      <div className="skeleton-spacer" />
      <SkeletonBlock width="100%" height="1rem" />
      <SkeletonBlock width="95%" height="1rem" />
      <SkeletonBlock width="40%" height="1rem" />
    </div>
  )
}

function FormSkeleton() {
  return (
    <div>
      <SkeletonBlock width="250px" height="2rem" />
      <div className="skeleton-spacer" />
      <SkeletonBlock width="50px" height="0.8rem" />
      <SkeletonBlock width="100%" height="2.5rem" />
      <div className="skeleton-spacer" />
      <div className="skeleton-split">
        <SkeletonBlock width="100%" height="400px" />
        <SkeletonBlock width="100%" height="400px" />
      </div>
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div>
      <SkeletonBlock width="300px" height="2rem" />
      <div className="skeleton-spacer" />
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBlock key={i} width={`${40 + Math.random() * 30}%`} height="1.2rem" />
      ))}
    </div>
  )
}

function AuthSkeleton() {
  return (
    <div className="skeleton-auth">
      <SkeletonBlock width="150px" height="2rem" />
      <div className="skeleton-spacer" />
      <SkeletonBlock width="80px" height="0.8rem" />
      <SkeletonBlock width="100%" height="2.5rem" />
      <div className="skeleton-spacer-sm" />
      <SkeletonBlock width="80px" height="0.8rem" />
      <SkeletonBlock width="100%" height="2.5rem" />
      <div className="skeleton-spacer" />
      <SkeletonBlock width="120px" height="2.5rem" />
    </div>
  )
}
