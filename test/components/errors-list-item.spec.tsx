import React from 'react';
import { render, screen } from '@testing-library/react';
import { GrammarParsingError } from '@syntaxica/lib';
import { ErrorsListItem } from '$components/errors-list/errors-list-item';

describe('ErrorsListItem', () => {
  const errorIndex = 1;
  const error: GrammarParsingError = {
    lineIndex: 2,
    charPosition: 3,
    message: 'Sample error message',
  };

  it('renders without crashing', () => {
    render(<ErrorsListItem errorIndex={errorIndex} error={error} />);
    const listItem = screen.getByTestId(`ti-parsing-status-errors--errors-list-element-${errorIndex}`);
    expect(listItem).toBeInTheDocument();
  });

  it('displays the correct error message', () => {
    render(<ErrorsListItem errorIndex={errorIndex} error={error} />);
    const listItem = screen.getByTestId(`ti-parsing-status-errors--errors-list-element-${errorIndex}`);
    expect(listItem.textContent).toBe(`[line ${error.lineIndex}:${error.charPosition}] ${error.message}`);
  });
});
