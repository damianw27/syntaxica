export interface CaretPosition {
  readonly x: number;
  readonly y: number;
}

export interface CaretData {
  readonly position: CaretPosition;
  readonly index: number;
}

export const defaultCaretData: CaretData = {
  position: {
    x: 0,
    y: 0,
  },
  index: 0,
};
