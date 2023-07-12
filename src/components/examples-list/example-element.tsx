import React, { ReactElement } from 'react';
import { Grammar } from 'prismjs';
import { GrammarExample } from '@syntaxica/lib/dist/lib/types/grammar-example';
import css from '$components/examples-list/examples-list.module.css';
import { ExampleCode } from '$components/examples-list/example-code';

interface ExampleElementProps {
  readonly example: GrammarExample;
  readonly grammar: Grammar;
  readonly onClick: (example: GrammarExample) => void;
}

export function ExampleElement({ example, grammar, onClick }: ExampleElementProps): ReactElement {
  return (
    <li className={css.example} onClick={() => onClick(example)} data-testid="ti-examples-list-item">
      <div className={css.exampleHeader} data-testid="ti-examples-list-item--title">
        {example.name}
      </div>
      <ExampleCode example={example} grammar={grammar} />
    </li>
  );
}
