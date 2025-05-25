import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function Input({
  label,
  error,
  icon,
  fullWidth = false,
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`
            block
            w-full
            rounded-md
            border
            border-gray-300
            dark:border-gray-700
            bg-white
            dark:bg-gray-800
            px-4
            py-2
            text-gray-900
            dark:text-gray-100
            placeholder-gray-500
            focus:border-blue-500
            focus:outline-none
            focus:ring-1
            focus:ring-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
} 