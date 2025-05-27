"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Portal } from "../portal/Portal";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  triggerRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (isOpen && triggerRef.current && dropdownRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      
      // Calculate the available space below and above the trigger
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Determine if the dropdown should be placed above or below
      const shouldPlaceAbove = spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height;
      
      // Calculate horizontal position
      let left = rect.left;
      const rightOverflow = left + dropdownRect.width - window.innerWidth;
      if (rightOverflow > 0) {
        left = Math.max(0, left - rightOverflow);
      }

      setPosition({
        top: shouldPlaceAbove 
          ? window.scrollY + rect.top - dropdownRect.height 
          : window.scrollY + rect.bottom,
        left: left
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      // Add touchstart event listener to handle touch events outside dropdown
      const handleTouchStart = (e: TouchEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && 
            triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
          e.preventDefault();
          onClose();
        }
      };
      
      document.addEventListener('touchstart', handleTouchStart);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
        document.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 99999,
          width: 'max-content',
          maxWidth: '90vw',
          WebkitOverflowScrolling: 'touch' // Improve scrolling on iOS
        }}
        className={`rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </Portal>
  );
};
