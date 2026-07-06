'use client';

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = 'text',
      className = '',
      id,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const hasRightAddon = rightIcon || isPassword;

    return (
      <div className={['w-full', className].filter(Boolean).join(' ')}>
        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
              {leftIcon}
            </span>
          )}

          {/* The actual input — uses placeholder=" " trick for peer-placeholder-shown */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            placeholder=" "
            className={[
              'peer w-full h-12 rounded-input border bg-surface px-4 pt-4 pb-1',
              'text-text-primary text-base font-body outline-none',
              'transition-all duration-200',
              'focus:ring-2',
              leftIcon ? 'pl-11' : '',
              hasRightAddon ? 'pr-11' : '',
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-border focus:border-primary focus:ring-primary/20',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...rest}
          />

          {/* Floating label */}
          {label && (
            <label
              htmlFor={inputId}
              className={[
                'absolute left-4 top-1/2 -translate-y-1/2',
                'text-text-tertiary text-base pointer-events-none',
                'origin-[0] transition-all duration-200',
                /* When input is focused or has value (:not(:placeholder-shown)) */
                'peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary',
                'peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs',
                leftIcon ? 'left-11' : '',
                error
                  ? 'peer-focus:text-error peer-[:not(:placeholder-shown)]:text-text-secondary'
                  : 'peer-[:not(:placeholder-shown)]:text-text-secondary',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
            </label>
          )}

          {/* Right icon or password toggle */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : (
            rightIcon && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
                {rightIcon}
              </span>
            )
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-text-secondary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
