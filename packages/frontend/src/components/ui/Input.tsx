import React, { type InputHTMLAttributes } from 'react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    label, 
    helperText, 
    error = false, 
    iconLeft, 
    iconRight, 
    fullWidth = true,
    ...props 
  }, ref) => {

    const wrapperStyle = fullWidth ? { width: '100%' } : {};

    return (
      <div className={`ui-input-container ${className}`} style={wrapperStyle}>
        {label && <label className="ui-input-label">{label}</label>}
        
        <div className="ui-input-wrapper">
          {iconLeft && (
            <span className="ui-input-icon left">{iconLeft}</span>
          )}
          
          <input
            ref={ref}
            className={`
              ui-input-field 
              ${error ? 'has-error' : ''} 
              ${iconLeft ? 'has-icon-left' : ''} 
              ${iconRight ? 'has-icon-right' : ''}
            `}
            {...props}
          />

          {iconRight && (
            <span className="ui-input-icon right">{iconRight}</span>
          )}
        </div>

        {helperText && (
          <span className={`ui-input-helper ${error ? 'error' : ''}`}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
