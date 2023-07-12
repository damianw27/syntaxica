import * as base64 from 'base64-js';
import pako from 'pako';
import { TextDecoder } from 'text-encoding-utf-8';

interface UseEncoding {
  readonly encode: (value: string) => string;
  readonly decode: (value: string) => string;
}

export const useEncoding = (): UseEncoding => {
  const encode = (value: string): string => {
    const compressed = pako.gzip(value);
    return base64.fromByteArray(compressed);
  };

  const decode = (value: string): string => {
    let validValue = value;

    if (validValue.length % 4 !== 0) {
      const length = validValue.length / 4;
      const lengthRound = Math.floor(length);
      const missingSignsCount = (length - lengthRound) * 4;

      for (let i = 0; i < missingSignsCount; i += 1) {
        validValue += '=';
      }
    }

    const decoded = base64.toByteArray(validValue);
    const decompressed = pako.ungzip(decoded);
    return new TextDecoder().decode(decompressed);
  };

  return { decode, encode };
};
