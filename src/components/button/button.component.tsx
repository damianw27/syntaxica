import React, { MouseEvent, ReactElement } from 'react';
import css from './button.module.css';
import { SpinnerIcon } from '$icons/spinner-icon/spinner-icon';
import { CopySuccessIcon } from '$icons/copy-success-icon/copy-success-icon';
import { ButtonIconPlacement } from '$components/button/enums/button-icon-placement';

export interface ButtonProps {
  readonly label: string;
  readonly icon?: ReactElement;
  readonly iconPlacement?: ButtonIconPlacement;
  readonly isLoading?: boolean;
  readonly isCopied?: boolean;
  readonly testId?: string;
  readonly onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function Button({
  testId,
  isCopied,
  isLoading,
  onClick,
  icon,
  iconPlacement,
  label,
}: ButtonProps): ReactElement {
  const drawLabelWithIcon = (targetLabel: string, targetIcon?: ReactElement): ReactElement => {
    if (icon === undefined) {
      return (
        <div className={css.buttonContentWrapper} data-testid={`${testId}--btn-content`}>
          <div className={css.buttonLabelWrapper} data-testid={`${testId}--btn-label`}>
            {targetLabel}
          </div>
        </div>
      );
    }

    switch (iconPlacement) {
      case ButtonIconPlacement.Left: {
        return (
          <div className={css.buttonContentWrapper} data-testid={`${testId}--btn-content`}>
            <div className={css.buttonIconWrapper} data-testid={`${testId}--btn-icon-left`}>
              {targetIcon}
            </div>
            <div className={css.buttonLabelWrapper} data-testid={`${testId}--btn-label`}>
              {targetLabel}
            </div>
          </div>
        );
      }

      case ButtonIconPlacement.Right: {
        return (
          <div className={css.buttonContentWrapper} data-testid={`${testId}--btn-content`}>
            <div className={css.buttonLabelWrapper} data-testid={`${testId}--btn-label`}>
              {targetLabel}
            </div>
            <div className={css.buttonIconWrapper} data-testid={`${testId}--btn-icon-right`}>
              {targetIcon}
            </div>
          </div>
        );
      }

      default: {
        return (
          <div className={css.buttonContentWrapper} data-testid={`${testId}--btn-content`}>
            <div className={css.buttonLabelWrapper} data-testid={`${testId}--btn-label`}>
              {targetLabel}
            </div>
          </div>
        );
      }
    }
  };

  const drawButtonContent = (): ReactElement => {
    if (isLoading) {
      return drawLabelWithIcon('', <SpinnerIcon testId="ti-button-spinner-icon" width="0.8rem" height="0.8rem" />);
    }

    if (isCopied) {
      return drawLabelWithIcon(
        'Copied!',
        <CopySuccessIcon testId="ti-button-copy-success-icon" width="0.8rem" height="0.8rem" />,
      );
    }

    return drawLabelWithIcon(label, icon);
  };

  return (
    <button type="button" className={css.button} onClick={onClick} data-testid={testId}>
      {drawButtonContent()}
    </button>
  );
}

Button.defaultProps = {
  iconPlacement: ButtonIconPlacement.Left,
  isLoading: false,
  isCopied: false,
  testId: 'ti-button',
};
