// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Destructor = (() => void) | void;

export type EffectCallback = () => Destructor;
