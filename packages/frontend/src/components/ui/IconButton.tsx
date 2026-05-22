import React, { type ButtonHTMLAttributes } from 'react';
import './IconButton.css';

export type IconButtonVariant = 'default' | 'ghost' | 'danger' | 'success';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    variant = 'default', 
    size = 'md', 
    icon,
    className = '', 
    ...props 
  }, ref) => {
    
    const classes = [
      'ui-icon-button',
      `icon-btn-variant-${variant}`,
      `icon-btn-size-${size}`,
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} {...props}>
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
