export interface IconSharedProps {
  readonly width?: number | string;
  readonly height?: number | string;
  readonly testId?: string;
}

export const defaultIconSharedProps: IconSharedProps = {
  width: 16,
  height: 16,
  testId: 'ti-icon',
};
