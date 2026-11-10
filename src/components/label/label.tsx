// @buildertech/ui - Label Component
// Label nativo accesible con required, ayuda, error

import { forwardRef, type LabelHTMLAttributes } from 'react';
import { clsx } from '../../lib/classnames';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Texto del label */
  children: React.ReactNode;

  /** Si es requerido */
  required?: boolean;

  /** Texto de ayuda */
  helpText?: string;

  /** Estado de error */
  error?: boolean;

  /** Tamaño */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-btc-caption',
  md: 'text-btc-control',
  lg: 'text-btc-body',
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required = false, helpText, error = false, size = 'md', className = '', htmlFor, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={clsx(
          'block font-medium mb-btc-1',
          sizeClasses[size],
          error ? 'text-btc-error' : 'text-btc-text-primary',
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {required && <span className="text-btc-error ml-btc-1" aria-hidden="true">*</span>}
        {helpText && !error && (
          <span className="ml-btc-2 text-btc-text-secondary font-normal">{helpText}</span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';