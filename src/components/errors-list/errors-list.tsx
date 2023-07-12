import React, { ReactElement } from 'react';
import { GrammarParsingError } from '@syntaxica/lib';
import styles from './errors-list.module.css';
import { SpinnerIcon } from '$icons/spinner-icon/spinner-icon';
import { CheckIcon } from '$icons/check-icon/check-icon';
import { ExclamationIcon } from '$icons/exclamation-icon/exclamation-icon';
import { ErrorsListItem } from '$components/errors-list/errors-list-item';

interface ErrorsListProps {
  readonly errors: GrammarParsingError[];
  readonly isParsing: boolean;
  readonly isInitializing: boolean;
}

export function ErrorsList({ errors, isInitializing, isParsing }: ErrorsListProps): ReactElement {
  if (isInitializing) {
    return (
      <span className={styles.parsing} data-testid="ti-parsing-status-initializing">
        <SpinnerIcon width={16} height={16} />
        <span className={styles.parsingStr} data-testid="ti-parsing-status-initializing--label">
          Initializing...
        </span>
      </span>
    );
  }

  if (isParsing) {
    return (
      <span className={styles.parsing} data-testid="ti-parsing-status-working">
        <SpinnerIcon width={16} height={16} />
        <span className={styles.parsingStr} data-testid="ti-parsing-status-working--label">
          Parsing...
        </span>
      </span>
    );
  }

  if (errors.length === 0) {
    return (
      <span className={styles.noErrors} data-testid="ti-parsing-status-no-errors">
        <CheckIcon />
        <span className={styles.noErrorsStr} data-testid="ti-parsing-status-no-errors--label">
          No errors!
        </span>
      </span>
    );
  }

  return (
    <div className={styles.errorsWrapper} data-testid="ti-parsing-status-errors--wrapper">
      <span className={styles.foundErrors} data-testid="ti-parsing-status-errors">
        <ExclamationIcon />
        <span
          className={styles.foundErrorsStr}
          data-testid="ti-parsing-status-errors--label"
        >{`Found '${errors.length}' parser errors`}</span>
      </span>
      <ul className={styles.errorsList} data-testid="ti-parsing-status-errors--errors-list">
        {errors.map((error, index) => (
          <ErrorsListItem key={`code-error-${index + new Date().getUTCDate()}`} errorIndex={index} error={error} />
        ))}
      </ul>
    </div>
  );
}
