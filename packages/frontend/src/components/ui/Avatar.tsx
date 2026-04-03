import React from 'react';
import './Avatar.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', initials, size = 'md', className = '' }) => {
  return (
    <div className={`ui-avatar avatar-size-${size} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="avatar-img" />
      ) : (
        <span className="avatar-initials">{initials}</span>
      )}
    </div>
  );
};
