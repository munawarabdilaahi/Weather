export function DetailRow({ icon: Icon, label, value, valueClassName = '' }) {
  return (
    <div className="flex items-center justify-between p-2 bg-secondary rounded-lg transition hover:bg-secondary/70">
      <span className="text-sm text-muted-foreground flex items-center gap-2">
        <Icon size={16} aria-hidden="true" />
        {label}
      </span>
      <span className={`font-bold text-foreground ${valueClassName}`}>{value}</span>
    </div>
  );
}