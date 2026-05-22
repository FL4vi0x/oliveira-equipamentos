import React from 'react';
import './ActionGroup.css';

export interface ActionGroupProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const ActionGroup: React.FC<ActionGroupProps> = ({ 
  children, 
  align = 'right',
  className = '' 
}) => {
  const classes = [
    'ui-action-group',
    `action-group-${align}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

ActionGroup.displayName = 'ActionGroup';
