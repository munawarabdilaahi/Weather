export function Skeleton({ className = '', ...props }) {
  return <div className={`animate-pulse bg-secondary rounded-lg ${className}`} aria-hidden="true" {...props} />;
}
