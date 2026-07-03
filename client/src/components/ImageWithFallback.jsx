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

  // Parse absolute asset URL for relative backend paths
  let imageSrc = src;
  if (src && (src.startsWith('/booksimages') || src.startsWith('/uploads'))) {
    // Extract base server URL from VITE_API_URL (remove '/api' suffix)
    const apiUrl = import.meta.env.VITE_API_URL || 'https://aurabooks-ba1r.onrender.com/api';
    const serverBaseUrl = apiUrl.replace(/\/api$/, '');
    imageSrc = `${serverBaseUrl}${src}`;
  }

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
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
