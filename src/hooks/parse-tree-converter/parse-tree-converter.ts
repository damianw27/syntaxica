import { Edge, Node } from 'vis-network';
import { useEffect, useState } from 'react';
import { isTreeRuleNode, isTreeTerminalNode, ParseTree, TreeNode } from '@syntaxica/lib';
import { ConvertResult } from '$hooks/parse-tree-converter/convert-result';

const TERMINAL_NODE_COLOR = '#2270ff';
const NON_TERMINAL_NODE_COLOR = '#00b69d';

interface UseParseTreeConverter {
  readonly isConverting: boolean;
  readonly convertResult: ConvertResult;
}

export const useParseTreeConverter = (parseTree: ParseTree): UseParseTreeConverter => {
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertResult, setConvertResult] = useState<ConvertResult>({ nodes: [], edges: [] });

  const loadDataFromParseTree = (nodes: Node[], edges: Edge[], targetTreeNodes: TreeNode[]): void => {
    const stack: { treeNodes: TreeNode[]; level: number; parent?: Node }[] = [];
    stack.push({ treeNodes: targetTreeNodes, level: 0 });

    while (stack.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { treeNodes, level, parent } = stack.pop()!;

      treeNodes.forEach((treeNode) => {
        const id = nodes.length;

        if (isTreeTerminalNode(treeNode)) {
          if (parent === undefined) {
            return;
          }

          const label = `(terminal)\n${treeNode.text}`;
          const color = TERMINAL_NODE_COLOR;
          const node: Node = { id, label, level, color };
          nodes.push(node);
        }

        if (isTreeRuleNode(treeNode)) {
          const label = `(non-terminal)\n${treeNode.name}`;
          const color = NON_TERMINAL_NODE_COLOR;
          const node: Node = { id, label, level, color };
          nodes.push(node);

          stack.push({
            treeNodes: treeNode.children,
            level: level + 1,
            parent: node,
          });
        }

        if (parent !== undefined) {
          const edge: Edge = { from: parent.id, to: id };
          edges.push(edge);
        }
      });
    }
  };

  useEffect(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (parseTree.length === 0) {
      setConvertResult({ nodes, edges });
      return;
    }

    setIsConverting(true);
    loadDataFromParseTree(nodes, edges, parseTree);
    setConvertResult({ nodes, edges });
    setIsConverting(false);
  }, [parseTree]);

  return { isConverting, convertResult };
};
