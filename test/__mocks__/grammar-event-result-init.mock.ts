import { GrammarEventResultInit, SyntaxType } from '@syntaxica/lib';

export const mockGrammarEventResultInit = (initResult?: Partial<GrammarEventResultInit>): GrammarEventResultInit => ({
  grammarDefinition: {
    name: 'mockGrammar',
    keywords: ['test'],
    syntax: [
      {
        syntaxType: SyntaxType.Keyword,
        pattern: {
          pattern: /test/g,
        },
      },
    ],
  },
  examples: [
    {
      name: 'mocked example',
      code: 'test code example\n',
    },
  ],
  ...(initResult ?? {}),
});
