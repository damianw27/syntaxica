import React, { ReactElement } from 'react';
import parse from 'html-react-parser';
import { Grammar, highlight } from 'prismjs';
import { GrammarExample } from '@syntaxica/lib/dist/lib/types/grammar-example';
import css from '$components/examples-list/examples-list.module.css';
import styles from '$hooks/highlights/highlight.module.css';

export interface ExampleCodeProps {
  readonly example: GrammarExample;
  readonly grammar: Grammar;
}

const NEW_LINE = '\n';
const NODE_REGEX = /(<span[^>]*>)((.|\n)*?)(<\/span>)/gi;

export function ExampleCode({ example, grammar }: ExampleCodeProps): ReactElement {
  const assemblyLine = (line: string, index: number): ReactElement => (
    <tr key={`example-code-line-${index}`} data-testid={`ti-code-line-${index}`}>
      <td className={css.lineNumberCell}>{index + 1}</td>
      <td className={css.codeLine}>{parse(line)}</td>
    </tr>
  );

  const splitMultilineNode = (
    match: string,
    openingTag: string,
    content: string,
    lastContentChar: string,
    closingTag: string,
    // eslint-disable-next-line max-params
  ) =>
    content
      .split('\n')
      .map((lineContent) => `${openingTag}${lineContent}${closingTag}`)
      .join('\n');

  const getCodeLines = (input: string): ReactElement[] =>
    highlight(input, grammar, 'lang').replace(NODE_REGEX, splitMultilineNode).split(NEW_LINE).map(assemblyLine);

  return (
    <pre className={css.exampleCode} data-testid="ti-examples-list-item--code">
      <div className={styles.highlightBackground}>
        <div className={styles.highlightLineNumberBackground} />
        <div className={styles.highlightLineBackground} />
      </div>
      <table className={styles.table}>
        <tbody data-testid="ti-code-lines">{getCodeLines(example.code.trim())}</tbody>
      </table>
    </pre>
  );
}
