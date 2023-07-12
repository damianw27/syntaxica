import { useEffect, useRef } from 'react';
import { EffectCallback } from '$hooks/debounce/types/effect-callback';
import { DebouncedEffectConfig, DEFAULT_EFFECT_CONFIG } from '$hooks/debounce/types/debounced-effect-config';
import { DEFAULT_EFFECT_DATA, EffectData } from '$hooks/debounce/types/effect-data';
import { isFunction } from '$root/utils/is-function';

export const useDebouncedEffect = (callback: EffectCallback, config: Partial<DebouncedEffectConfig>): void => {
  const { deps, delay, ignoreInitialCall } = { ...DEFAULT_EFFECT_CONFIG, ...config };
  const effectDataRef = useRef<EffectData>(DEFAULT_EFFECT_DATA);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const updateEffectData = (data: Partial<EffectData>): void => {
    effectDataRef.current = {
      ...effectDataRef.current,
      ...data,
    };
  };

  useEffect(() => {
    const { firstRender, destructorCallback } = effectDataRef.current;

    if (firstRender) {
      updateEffectData({ firstRender: false });

      if (ignoreInitialCall) {
        return () => {};
      }
    }

    timerRef.current = setTimeout(() => {
      if (isFunction(destructorCallback)) {
        destructorCallback();
      }

      updateEffectData({ destructorCallback: callback() });
    }, delay);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay, ignoreInitialCall, ...deps]);
};
