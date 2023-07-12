import { Destructor } from '$hooks/debounce/types/effect-callback';

export interface EffectData {
  firstRender: boolean;
  destructorCallback?: Destructor;
}

export const DEFAULT_EFFECT_DATA: EffectData = {
  firstRender: true,
};
