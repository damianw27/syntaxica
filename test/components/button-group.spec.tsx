import React from 'react';
import { render } from '@testing-library/react';
import { ButtonGroup } from '$components/button-group/button-group';

describe('ButtonGroup', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ButtonGroup>
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </ButtonGroup>,
    );

    expect(getByText('Button 1')).toBeInTheDocument();
    expect(getByText('Button 2')).toBeInTheDocument();
    expect(getByText('Button 3')).toBeInTheDocument();
  });

  it('applies the correct CSS class', () => {
    const { container } = render(<ButtonGroup />);

    expect(container.firstChild).toHaveClass('buttonGroup');
  });
});
