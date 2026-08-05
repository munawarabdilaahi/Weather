export function Skeleton({ className = '', ...props }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} aria-hidden="true" {...props} />;
}
