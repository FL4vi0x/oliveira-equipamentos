import React from 'react';
import './Badge.css';

export type BadgeVariant = 'success' | 'warning' | 'critical' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`ui-badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};
