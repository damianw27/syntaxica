import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Grammar } from 'prismjs';
import Fuse from 'fuse.js';
import { GrammarExample } from '@syntaxica/lib/dist/lib/types/grammar-example';
import css from '$components/examples-list/examples-list.module.css';
import { useDebounce } from '$hooks/debounce/debounce';
import { ExampleElement } from '$components/examples-list/example-element';
import { SpinnerIcon } from '$icons/spinner-icon/spinner-icon';

interface ExamplesListProps {
  readonly grammar: Grammar;
  readonly examples: GrammarExample[];
  readonly isLoading: boolean;
  readonly onExampleClick: (example: GrammarExample) => void;
}

type ExamplesFuse = Fuse<GrammarExample>;

const fuseOptions = {
  includeScore: false,
  shouldSort: true,
  keys: ['name', 'code'],
};

export function ExamplesList({ examples, grammar, isLoading, onExampleClick }: ExamplesListProps): ReactElement {
  const [fuse, setFuse] = useState<ExamplesFuse>(new Fuse([], fuseOptions));
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [currentExamples, setCurrentExamples] = useState<GrammarExample[]>(examples);
  const debouncedSearchPhrase = useDebounce(searchPhrase, 500);

  const searchForExamples = useCallback(
    (pattern: string): GrammarExample[] => fuse.search(pattern).map((result) => result.item),
    [fuse],
  );

  useEffect(() => {
    if (examples.length === 0) {
      return;
    }

    setFuse(new Fuse(examples, fuseOptions));
    const foundExamples = searchForExamples(searchPhrase);
    setCurrentExamples(foundExamples);
  }, [examples, searchForExamples, searchPhrase]);

  const handleExampleClick = (example: GrammarExample): void => {
    window.scrollTo(0, 0);
    onExampleClick(example);
  };

  useEffect(() => {
    if (examples.length === 0) {
      return;
    }

    if (debouncedSearchPhrase === '') {
      setCurrentExamples(examples);
      return;
    }

    const foundExamples = searchForExamples(debouncedSearchPhrase);
    setCurrentExamples(foundExamples);
  }, [debouncedSearchPhrase, examples, searchForExamples]);

  return (
    <div className={css.examplesWrapper} data-testid="ti-examples-wrapper">
      <div className={css.examplesHeader} data-testid="ti-examples-title">
        Examples
      </div>
      <input
        type="text"
        className={css.examplesSearch}
        placeholder="Search..."
        onChange={(event) => setSearchPhrase(event.target.value)}
        data-testid="ti-examples-search-input"
      />
      {isLoading ? (
        <div className={css.examplesLoadingWrapper}>
          <SpinnerIcon testId="ti-loading-examples" width="64" height="64" />
        </div>
      ) : (
        <ul className={css.examplesList} data-testid="ti-examples-list">
          {currentExamples.map((example, index) => (
            <ExampleElement
              key={`example-${index + 1}`}
              example={example}
              grammar={grammar}
              onClick={(clickedExample) => handleExampleClick(clickedExample)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
