// @buildertech/ui - CopyButton Component
// Botón para copiar al portapapeles con feedback visual

import { useState, type ButtonHTMLAttributes } from 'react';
import { clsx } from '../../lib/classnames';
import { Button } from '../button';

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onCopy'> {
  /** Texto a copiar */
  text: string;

  /** Etiqueta para accesibilidad */
  'aria-label'?: string;

  /** Texto cuando se copió */
  successText?: string;

  /** Texto por defecto */
  defaultText?: string;

  /** Icono por defecto */
  icon?: string;

  /** Icono de éxito */
  successIcon?: string;

  /** Tiempo de feedback en ms */
  feedbackDuration?: number;

  /** Variante del botón */
  variant?: 'ghost' | 'outline' | 'primary';

  /** Tamaño */
  size?: 'sm' | 'md' | 'lg';

  /** Callback al copiar */
  onCopy?: (success: boolean) => void;
}

export function CopyButton({
  text,
  'aria-label': ariaLabel = 'Copiar al portapapeles',
  successText = '¡Copiado!',
  defaultText = 'Copiar',
  icon = 'copy',
  successIcon = 'check',
  feedbackDuration = 2000,
  variant = 'ghost',
  size = 'md',
  onCopy,
  className = '',
  disabled,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.(true);
      setTimeout(() => setCopied(false), feedbackDuration);
    } catch {
      onCopy?.(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      leftIcon={copied ? successIcon : icon}
      leftIconCategory="action"
      onClick={() => { void handleCopy(); }}
      disabled={disabled || copied}
      aria-label={ariaLabel}
      className={clsx('transition-btc-colors', copied && 'bg-btc-success-bg text-btc-success border-btc-success/20', className)}
      {...props}
    >
      {copied ? successText : defaultText}
    </Button>
  );
}