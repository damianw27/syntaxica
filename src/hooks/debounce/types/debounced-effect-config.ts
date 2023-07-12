import { DependencyList } from 'react';

export interface DebouncedEffectConfig {
  readonly delay: number;
  readonly deps: DependencyList;
  readonly ignoreInitialCall: boolean;
}

export const DEFAULT_EFFECT_CONFIG: DebouncedEffectConfig = {
  delay: 100,
  deps: [],
  ignoreInitialCall: false,
};
