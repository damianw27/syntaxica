import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { ParseTree } from '@syntaxica/lib';
import { parseTreeViewOptions } from '$components/parse-tree/parse-tree-view-options';
import css from '$components/parse-tree/parse-tree.module.css';
import { SpinnerIcon } from '$icons/spinner-icon/spinner-icon';
import { useParseTreeConverter } from '$hooks/parse-tree-converter/parse-tree-converter';

export interface ParseTreeViewProps {
  readonly isParsing: boolean;
  readonly parseTree: ParseTree;
}

export function ParseTreeView({ parseTree, isParsing }: ParseTreeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const { isConverting, convertResult } = useParseTreeConverter(parseTree);

  useEffect(() => {
    if (containerRef.current === null) {
      return () => {};
    }

    networkRef.current?.destroy();
    const container = containerRef.current;
    const { nodes, edges } = convertResult;
    networkRef.current = new Network(container, { nodes, edges }, parseTreeViewOptions);
    networkRef.current?.fit();
    networkRef.current?.redraw();

    return () => {
      networkRef.current?.destroy();
      networkRef.current = null;
    };
  }, [isParsing, convertResult]);

  return (
    <div className={css.parseTree}>
      <div className={css.parseTreeLoadingWrapper} style={{ display: isParsing || isConverting ? 'inherit' : 'none' }}>
        <SpinnerIcon testId="ti-loading-parse-tree" width="64" height="64" />
      </div>
      <div
        ref={containerRef}
        className={css.parseTreeView}
        data-testid="ti-parse-tree--container"
        style={{ display: isParsing || isConverting ? 'none' : 'inherit' }}
      />
    </div>
  );
}
