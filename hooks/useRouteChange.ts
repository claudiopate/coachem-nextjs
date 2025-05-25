import { useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useRouteChange(onRouteChange: () => void) {
  const pathname = usePathname();
  const router = useRouter();

  const handleRouteChange = useCallback(() => {
    // Ensure the callback is executed in the next tick
    setTimeout(onRouteChange, 0);
  }, [onRouteChange]);

  useEffect(() => {
    handleRouteChange();
  }, [pathname, handleRouteChange]);

  return handleRouteChange;
} 