import React from 'react';
import { render, screen } from '@testing-library/react';
import { GrammarParsingError } from '@syntaxica/lib';
import { ErrorsList } from '$components/errors-list/errors-list';

describe('ErrorsList', () => {
  test('renders SpinnerIcon when isInitializing is true', () => {
    render(<ErrorsList isInitializing isParsing={false} errors={[]} />);
    expect(screen.getByTestId('ti-parsing-status-initializing')).toBeInTheDocument();
    expect(screen.getByTestId('ti-parsing-status-initializing--label')).toHaveTextContent('Initializing...');
  });

  test('renders SpinnerIcon when isParsing is true', () => {
    render(<ErrorsList isInitializing={false} isParsing errors={[]} />);
    expect(screen.getByTestId('ti-parsing-status-working')).toBeInTheDocument();
    expect(screen.getByTestId('ti-parsing-status-working--label')).toHaveTextContent('Parsing...');
  });

  test('renders CheckIcon when there are no errors and isParsing is false', () => {
    render(<ErrorsList isInitializing={false} isParsing={false} errors={[]} />);
    expect(screen.getByTestId('ti-parsing-status-no-errors')).toBeInTheDocument();
    expect(screen.getByTestId('ti-parsing-status-no-errors--label')).toHaveTextContent('No errors!');
  });

  test('renders error count and error list items when there are errors and isParsing is false', () => {
    const errors: GrammarParsingError[] = [
      { message: 'Error 1', lineIndex: 1, charPosition: 1 },
      { message: 'Error 2', lineIndex: 2, charPosition: 1 },
    ];

    render(<ErrorsList isInitializing={false} isParsing={false} errors={errors} />);
    expect(screen.getByTestId('ti-parsing-status-errors--wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('ti-parsing-status-errors--label')).toHaveTextContent("Found '2' parser errors");
    expect(screen.getByTestId('ti-parsing-status-errors--errors-list-element-0')).toBeInTheDocument();
    expect(screen.getByTestId('ti-parsing-status-errors--errors-list-element-1')).toBeInTheDocument();
  });
});
