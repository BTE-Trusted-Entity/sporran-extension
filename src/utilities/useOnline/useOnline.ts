import { useEffect, useState } from 'react';

export function useOnline(): boolean {
  const [online, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    function update() {
      setOnline(window.navigator.onLine);
    }

    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return online;
}
