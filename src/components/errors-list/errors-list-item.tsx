import React, { ReactElement } from 'react';
import { GrammarParsingError } from '@syntaxica/lib';
import styles from '$components/errors-list/errors-list.module.css';

interface ErrorsListItemProps {
  readonly errorIndex: number;
  readonly error: GrammarParsingError;
}

export function ErrorsListItem({ error, errorIndex }: ErrorsListItemProps): ReactElement {
  const parserErrorToString = (targetError: GrammarParsingError): string =>
    `[line ${targetError.lineIndex}:${targetError.charPosition}] ${targetError.message}`;

  return (
    <li
      key={`code-error-${errorIndex}`}
      className={styles.errorsListElement}
      data-testid={`ti-parsing-status-errors--errors-list-element-${errorIndex}`}
    >
      {parserErrorToString(error)}
    </li>
  );
}
