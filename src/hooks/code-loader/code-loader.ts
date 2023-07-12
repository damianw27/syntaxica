import { useEffect, useState } from 'react';
import { useEncoding } from '$hooks/encoding/encoding';

export const useCodeLoader = (): string | undefined => {
  const { decode } = useEncoding();
  const [loadedCode, setLoadedCode] = useState<string>();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedCode = urlParams.get('code');

    if (encodedCode === null) {
      return;
    }

    const t = decodeURIComponent(encodedCode);
    const decodedCode = decode(t);
    setLoadedCode(decodedCode);
  }, [decode]);

  return loadedCode;
};
