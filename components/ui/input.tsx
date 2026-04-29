import React from 'react';

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`px-3 py-2 border border-gray-300 rounded w-full ${className || ''}`}
      {...props}
    />
  );
}
