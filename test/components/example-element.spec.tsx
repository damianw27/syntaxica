import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleElement } from '$components/examples-list/example-element';

const example = {
  name: 'Example Name',
  code: 'const t = 10;',
};

const grammar = {};

const mockOnClick = jest.fn();

describe('ExampleElement', () => {
  beforeEach(() => {
    render(<ExampleElement example={example} grammar={grammar} onClick={mockOnClick} />);
  });

  it('should render the example name', () => {
    const exampleName = screen.getByText('Example Name');
    expect(exampleName).toBeInTheDocument();
  });

  it('should render the ExampleCode component', () => {
    const codeLines = screen.getByTestId('ti-code-lines');
    expect(codeLines).toBeInTheDocument();
  });

  it('should call the onClick handler when clicked', () => {
    const exampleElement = screen.getByRole('listitem');

    fireEvent.click(exampleElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(example);
  });
});
