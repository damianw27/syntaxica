import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { GrammarValue, highlight } from 'prismjs';
import parse from 'html-react-parser';
import { GrammarEventResultInit, GrammarEventResultParse } from '@syntaxica/lib';
import css from '$hooks/highlights/highlight.module.css';

interface UseHighlightsProps {
  readonly specification?: GrammarEventResultInit;
  readonly parseResult?: GrammarEventResultParse;
}

interface UseHighlights {
  readonly highlight: (code: string) => ReactElement;
  readonly grammar?: Record<string, GrammarValue>;
}

const NEW_LINE = '\n';
const NODE_REGEX = /(<span[^>]*>)((.|\n)*?)(<\/span>)/gi;

const cssClassNames: Record<string, string> = {
  keyword: css.keyword,
  punctuation: css.punctuation,
  comment: css.comment,
  string: css.string,
  boolean: css.boolean,
  number: css.number,
  custom1: css.custom1,
  custom2: css.custom2,
  custom3: css.custom3,
  custom4: css.custom4,
};

export const useHighlights = ({ specification, parseResult }: UseHighlightsProps): UseHighlights => {
  const [grammar, setGrammar] = useState<Record<string, GrammarValue>>();

  const hasLineAnyError = useCallback(
    (lineIndex: number): boolean => (parseResult?.errors ?? []).some((error) => error.lineIndex === lineIndex),
    [parseResult],
  );

  const assemblyLine = useCallback(
    (line: string, index: number): ReactElement => {
      const hasError = hasLineAnyError(index + 1);

      return (
        <tr
          key={`code-line-${index}`}
          className={hasError ? css.codeLineError : undefined}
          data-testid={hasError ? 'ti-higlights-code-line-error' : 'ti-higlights-code-line'}
        >
          <td className={css.lineNumberCell} data-testid="ti-higlights-code-line--number-cell">
            {index + 1}
          </td>
          <td className={css.codeLine} data-testid="ti-higlights-code-line--code-cell">
            {parse(line)}
          </td>
        </tr>
      );
    },
    [hasLineAnyError],
  );

  useEffect(() => {
    if (specification === undefined) {
      return;
    }

    const { grammarDefinition } = specification;
    const languageGrammar: Record<string, GrammarValue> = {};

    grammarDefinition.syntax.forEach((syntaxObject) => {
      const syntaxObjectIdentifier = cssClassNames[syntaxObject.syntaxType];

      let pattern: GrammarValue;

      if (Array.isArray(syntaxObject.pattern)) {
        pattern = syntaxObject.pattern.map((syntaxToken) => ({
          pattern: syntaxToken.pattern,
          greedy: syntaxToken.greedy,
          lookbehind: syntaxToken.lookbehind,
        }));
      } else {
        pattern = {
          pattern: syntaxObject.pattern.pattern,
          greedy: syntaxObject.pattern.greedy,
          lookbehind: syntaxObject.pattern.lookbehind,
        };
      }

      languageGrammar[syntaxObjectIdentifier] = pattern;
    });

    setGrammar(languageGrammar);
  }, [specification, parseResult]);

  const splitMultilineNode = (
    match: string,
    openingTag: string,
    content: string,
    lastContentChar: string,
    closingTag: string,
    // eslint-disable-next-line max-params
  ) =>
    content
      .split(NEW_LINE)
      .map((lineContent) => `${openingTag}${lineContent}${closingTag}`)
      .join(NEW_LINE);

  const highlightCallback = useCallback(
    (code: string): ReactElement => {
      const highlighted: ReactElement[] = highlight(code, grammar || {}, 'lang')
        .replace(NODE_REGEX, splitMultilineNode)
        .replaceAll('class="token', `class="${css.token}`)
        .split(NEW_LINE)
        .map(assemblyLine);

      return (
        <>
          <div className={css.highlightBackground} data-testid="ti-higlights--bg">
            <div className={css.highlightLineNumberBackground} data-testid="ti-higlights--line-number-bg" />
            <div className={css.highlightLineBackground} data-testid="ti-higlights--line-bg" />
          </div>
          <table className={css.table} data-testid="ti-higlights--code-table">
            <tbody data-testid="ti-higlights--code-table-body">{highlighted}</tbody>
          </table>
        </>
      );
    },
    [assemblyLine, grammar],
  );

  return {
    highlight: highlightCallback,
    grammar,
  };
};
