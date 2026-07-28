export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseClasses = 'font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-secondary text-foreground hover:bg-secondary/80 border border-border',
    ghost: 'text-foreground hover:bg-secondary/50',
    outline: 'border border-border text-foreground hover:bg-secondary/50',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
