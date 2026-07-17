'use client';

import { useEffect } from 'react';
import { useToast } from './Toast';

export function GlobalToastListener() {
  const { show } = useToast();

  useEffect(() => {
    const handleForbidden = (event: Event) => {
      const customEvent = event as CustomEvent;
      show(customEvent.detail || 'You are not authorized to view this patient\'s records.', 'error');
    };

    window.addEventListener('auth:forbidden', handleForbidden);
    return () => {
      window.removeEventListener('auth:forbidden', handleForbidden);
    };
  }, [show]);

  return null;
}
