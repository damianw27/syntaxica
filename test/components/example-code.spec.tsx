import React from 'react';
import { render } from '@testing-library/react';
import { ExampleCode } from '$components/examples-list/example-code';

const COMMENT_BLOCK_REGEX = /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/;
const COMMENT_REGEX = /(^|[^\\:])\/\/.*/;
const STRING_REGEX = /(["'`])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

describe('ExampleCode', () => {
  const example = {
    name: 'test',
    code: `
      const greeting = 'Hello, world!';
      console.log(greeting);
      /*
      example comment
      */
    `,
  };

  const grammar = {
    comment: [
      {
        pattern: COMMENT_BLOCK_REGEX,
        greedy: true,
      },
      {
        pattern: COMMENT_REGEX,
        greedy: true,
      },
    ],
    string: {
      pattern: STRING_REGEX,
      greedy: true,
    },
  };

  it('should renders code lines correctly', () => {
    const { getByTestId, getAllByTestId } = render(<ExampleCode example={example} grammar={grammar} />);
    const codeLinesContainer = getByTestId('ti-code-lines');
    const codeLines = getAllByTestId(/^(ti-code-line-)/);

    expect(codeLinesContainer).toBeVisible();
    expect(codeLines.length).toBe(5);
    expect(codeLines[0]).toHaveTextContent('1');
    expect(codeLines[0]).toHaveTextContent("const greeting = 'Hello, world!';");
    expect(codeLines[1]).toHaveTextContent('2');
    expect(codeLines[1]).toHaveTextContent('console.log(greeting);');
    expect(codeLines[2]).toHaveTextContent('3');
    expect(codeLines[2]).toHaveTextContent('/*');
    expect(codeLines[3]).toHaveTextContent('4');
    expect(codeLines[3]).toHaveTextContent('example comment');
    expect(codeLines[4]).toHaveTextContent('5');
    expect(codeLines[4]).toHaveTextContent('*/');
  });

  it('should apply code highlighting', () => {
    const { getByTestId } = render(<ExampleCode example={example} grammar={grammar} />);
    const codeLinesContainer = getByTestId('ti-code-lines');
    const strings = codeLinesContainer.getElementsByClassName('token string');
    const comments = codeLinesContainer.getElementsByClassName('token comment');

    expect(codeLinesContainer).toBeVisible();
    expect(strings.length).toBe(1);
    expect(comments.length).toBe(3);
  });

  it('applies syntax highlighting', () => {
    const { getByTestId } = render(<ExampleCode example={example} grammar={grammar} />);
    const codeLinesContainer = getByTestId('ti-code-lines');
    const strings = codeLinesContainer.getElementsByClassName('token string');
    const comments = codeLinesContainer.getElementsByClassName('token comment');

    expect(codeLinesContainer).toBeVisible();
    expect(strings.length).toBe(1);
    expect(comments.length).toBe(3);
  });

  it('should properly render multiline grammar elements', () => {
    let commentsExample = {
      name: 'comments example',
      code: `
      // inline comment
      `,
    };

    const { getByTestId, rerender } = render(<ExampleCode example={commentsExample} grammar={grammar} />);
    const codeLinesContainer = getByTestId('ti-code-lines');

    expect(codeLinesContainer.getElementsByClassName('token comment').length).toBe(1);

    commentsExample = {
      ...commentsExample,
      code: `
      /*
       multiline comment
       example
      */
      `,
    };

    rerender(<ExampleCode example={commentsExample} grammar={grammar} />);

    expect(codeLinesContainer.getElementsByClassName('token comment').length).toBe(4);
  });
});
