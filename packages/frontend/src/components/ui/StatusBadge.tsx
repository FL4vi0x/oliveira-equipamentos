import React from 'react';
import './StatusBadge.css';

export type StatusBadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

export interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusBadgeVariant;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const classes = [
    'ui-status-badge',
    `status-badge-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
