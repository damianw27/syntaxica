import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button, ButtonProps } from '$components/button/button.component';
import { ButtonIconPlacement } from '$components/button/enums/button-icon-placement';

describe('Button', () => {
  const defaultProps: ButtonProps = {
    label: 'Test Button',
    onClick: jest.fn(),
  };

  it('should render the button with label', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    const button = getByText('Test Button');

    expect(button).toBeInTheDocument();
  });

  it('should render the button with icon on the left', () => {
    const { getByTestId, getByText } = render(
      <Button {...defaultProps} icon={<span data-testid="test-icon">Icon</span>} />,
    );

    const icon = getByTestId('test-icon');
    const label = getByText('Test Button');

    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(icon.parentElement?.nextSibling).toEqual(label);
  });

  it('should render the button with icon on the right', () => {
    const { getByTestId, getByText } = render(
      <Button
        {...defaultProps}
        icon={<span data-testid="test-icon">Icon</span>}
        iconPlacement={ButtonIconPlacement.Right}
      />,
    );

    const icon = getByTestId('test-icon');
    const label = getByText('Test Button');

    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(icon.parentElement?.previousSibling).toEqual(label);
  });

  it('should render the button with loading spinner', () => {
    const { getByTestId } = render(<Button {...defaultProps} isLoading />);
    const spinner = getByTestId('ti-button-spinner-icon');

    expect(spinner).toBeInTheDocument();
  });

  it('should render the button with copied label', () => {
    const { getByText, getByTestId } = render(<Button {...defaultProps} isCopied />);
    const label = getByText('Copied!');
    const copySuccess = getByTestId('ti-button-copy-success-icon');

    expect(label).toBeInTheDocument();
    expect(copySuccess).toBeInTheDocument();
  });

  it('should call onClick handler when button is clicked', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    const button = getByText('Test Button');

    fireEvent.click(button);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should not render icon when placement is not provided', () => {
    const { queryByTestId, getByText } = render(
      <Button
        {...defaultProps}
        icon={<span data-testid="test-icon">Icon</span>}
        iconPlacement={-1 as ButtonIconPlacement}
      />,
    );
    const icon = queryByTestId('test-icon');
    const label = getByText('Test Button');

    expect(icon).not.toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });
});
