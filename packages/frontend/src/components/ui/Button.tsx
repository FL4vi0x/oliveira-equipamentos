import React, { type ButtonHTMLAttributes } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    fullWidth = false,
    icon,
    iconPosition = 'left',
    ...props 
  }, ref) => {
    
    const classes = [
      'ui-button',
      `btn-variant-${variant}`,
      `btn-size-${size}`,
      fullWidth ? 'w-full' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} {...props} style={fullWidth ? { width: '100%' } : {}}>
        {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
