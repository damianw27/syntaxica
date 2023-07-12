import { GrammarEventResultParse } from '@syntaxica/lib';

export const mockGrammarEventResultParse = (
  parseResult?: Partial<GrammarEventResultParse>,
): GrammarEventResultParse => ({
  text: 'example code',
  parseTree: [
    {
      name: 'start',
      children: [
        {
          name: 'example1',
          text: 'example',
          type: 1,
        },
        {
          name: 'code1',
          text: 'code',
          type: 2,
        },
      ],
    },
  ],
  isInvalid: false,
  errors: [],
  suggestions: [],
  ...(parseResult ?? {}),
});
