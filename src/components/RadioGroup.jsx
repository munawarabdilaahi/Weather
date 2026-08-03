export function RadioGroup({ label, children, className = '' }) {
  function handleKeyDown(e) {
    const isForward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const isBackward = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!isForward && !isBackward) return;

    const radios = Array.from(e.currentTarget.querySelectorAll('[role="radio"]')).filter(
      (el) => !el.hasAttribute('disabled')
    );
    if (radios.length === 0) return;

    const index = radios.indexOf(document.activeElement);
    if (index === -1) return;

    e.preventDefault();
    const next = isForward
      ? (index + 1) % radios.length
      : (index - 1 + radios.length) % radios.length;
    radios[next].focus();
    radios[next].click();
  }

  return (
    <div role="radiogroup" aria-label={label} onKeyDown={handleKeyDown} className={className}>
      {children}
    </div>
  );
}
