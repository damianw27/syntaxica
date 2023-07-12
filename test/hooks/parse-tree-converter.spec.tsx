import { renderHook, waitFor } from '@testing-library/react';
import { ParseTree } from '@syntaxica/lib';
import { useParseTreeConverter } from '$hooks/parse-tree-converter/parse-tree-converter';

describe('useParseTreeConverter', () => {
  const mockParseTree = [
    {
      name: 'test1',
      children: [
        {
          name: 'test2',
          text: 'Test 2',
          type: 1,
        },
        {
          name: 'test1',
          children: [
            {
              name: 'test2',
              text: 'Test 2',
              type: 1,
            },
            {
              name: 'test2',
              text: 'Test 2',
              type: 1,
            },
          ],
        },
      ],
    },
  ];

  it('converts parseTree to nodes and edges correctly', async () => {
    const { result } = renderHook(() => useParseTreeConverter(mockParseTree));
    await waitFor(() => result.current.convertResult.nodes.length !== 0);
    const { nodes, edges } = result.current.convertResult;

    const expectedNodes = [
      { id: 0, label: '(non-terminal)\ntest1', level: 0, color: '#00b69d' },
      { id: 1, label: '(terminal)\nTest 2', level: 1, color: '#2270ff' },
      { id: 2, label: '(non-terminal)\ntest1', level: 1, color: '#00b69d' },
      { id: 3, label: '(terminal)\nTest 2', level: 2, color: '#2270ff' },
      { id: 4, label: '(terminal)\nTest 2', level: 2, color: '#2270ff' },
    ];

    const expectedEdges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
    ];

    expect(nodes).toEqual(expectedNodes);
    expect(edges).toEqual(expectedEdges);
  });

  it('handles empty parseTree', async () => {
    const emptyParseTree: ParseTree = [];
    const { result } = renderHook(() => useParseTreeConverter(emptyParseTree));
    const { nodes, edges } = result.current.convertResult;
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });
});
