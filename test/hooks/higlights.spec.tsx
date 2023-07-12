import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import { GrammarEventResultInit, GrammarEventResultParse } from '@syntaxica/lib';
import { useHighlights } from '$hooks/highlights/highlights';
import { mockGrammarEventResultInit } from '$test-mocks/grammar-event-result-init.mock';

jest.mock('prismjs', () => ({
  highlight: jest.fn().mockImplementation((code) => `<span>${code}</span>`),
}));

jest.mock('html-react-parser', () => jest.fn().mockImplementation((code) => code));

interface MockComponentProps {
  specification?: GrammarEventResultInit;
  parseResult?: GrammarEventResultParse;
}

function MockComponent({ specification, parseResult }: MockComponentProps) {
  const { highlight } = useHighlights({ specification, parseResult });
  const code = 'test code';
  return <div>{highlight(code)}</div>;
}

MockComponent.defaultProps = {
  specification: undefined,
  parseResult: undefined,
};

describe('useHighlights', () => {
  it('should render with highlighted code', () => {
    const specification = mockGrammarEventResultInit();
    const { rerender } = render(<MockComponent specification={specification} parseResult={undefined} />);

    act(() => rerender(<MockComponent specification={specification} parseResult={undefined} />));

    expect(screen.getByText(/test code/)).toBeInTheDocument();
  });

  it('should render with default grammar when specification is not provided', () => {
    const { rerender } = render(<MockComponent specification={undefined} parseResult={undefined} />);

    act(() => rerender(<MockComponent specification={undefined} parseResult={undefined} />));

    expect(screen.getByText(/test code/)).toBeInTheDocument();
  });
});
