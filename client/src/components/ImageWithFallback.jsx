import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, title }) => {
  const [error, setError] = useState(false);

  const getInitials = (text) => {
    if (!text) return 'BK';
    return text
      .split(' ')
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-tr from-brand-500 to-accent-600 text-white font-bold font-display select-none shadow-inner ${className}`}
      >
        <span className="text-lg tracking-wider">{getInitials(title || alt)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
