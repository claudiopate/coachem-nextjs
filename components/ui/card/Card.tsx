import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`
      w-full 
      rounded-lg 
      bg-white 
      dark:bg-gray-800 
      shadow-sm
      overflow-hidden
      p-4
      sm:p-6
      ${className}
    `}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`
      flex 
      flex-col 
      space-y-1.5 
      p-2
      sm:p-4
      ${className}
    `}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`
      p-2
      sm:p-4 
      pt-0
      ${className}
    `}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`
      flex 
      items-center
      p-2
      sm:p-4 
      pt-0
      ${className}
    `}>
      {children}
    </div>
  );
} 