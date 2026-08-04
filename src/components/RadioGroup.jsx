import { useEffect, useRef } from 'react';

export function RadioGroup({ label, labelledBy, id, children, className = '' }) {
  const groupRef = useRef(null);

  useEffect(() => {
    const radios = groupRef.current?.querySelectorAll('[role="radio"]');
    radios?.forEach((el) => {
      el.tabIndex = el.getAttribute('aria-checked') === 'true' ? 0 : -1;
    });
  });

  function handleKeyDown(e) {
    const isForward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const isBackward = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!isForward && !isBackward && e.key !== 'Home' && e.key !== 'End') return;

    const radios = Array.from(groupRef.current.querySelectorAll('[role="radio"]')).filter(
      (el) => !el.hasAttribute('disabled')
    );
    if (radios.length === 0) return;

    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const target = e.key === 'Home' ? radios[0] : radios[radios.length - 1];
      target.focus();
      target.click();
      return;
    }

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
    <div
      ref={groupRef}
      id={id}
      role="radiogroup"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      onKeyDown={handleKeyDown}
      className={className}
    >
      {children}
    </div>
  );
}
