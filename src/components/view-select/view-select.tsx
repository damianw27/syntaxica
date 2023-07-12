import React, { ReactElement, useCallback } from 'react';
import styles from '$components/view-select/view-select.module.css';
import { CodeEditorViewType } from '$components/code-editor/types/code-editor-view-type';

interface ViewSelectProps {
  readonly value: CodeEditorViewType;
  readonly isParseTreeViewDisabled: boolean;
  readonly onViewSelectChange: (viewType: CodeEditorViewType) => void;
}

export function ViewSelect({ value, isParseTreeViewDisabled, onViewSelectChange }: ViewSelectProps): ReactElement {
  const getClassName = useCallback(
    (viewType: CodeEditorViewType) =>
      value === viewType ? `${styles.selectOption} ${styles.selectedOption}` : styles.selectOption,
    [value],
  );

  return (
    <div className={styles.viewSelect} data-testid="ti-view-select--wrapper">
      <button
        type="button"
        onClick={() => onViewSelectChange(CodeEditorViewType.Editor)}
        className={getClassName(CodeEditorViewType.Editor)}
        data-testid="ti-view-select--editor-button"
      >
        Editor
      </button>
      <button
        type="button"
        onClick={() => onViewSelectChange(CodeEditorViewType.ParseTree)}
        className={getClassName(CodeEditorViewType.ParseTree)}
        data-testid="ti-view-select--wrapper--parse-tree"
        disabled={isParseTreeViewDisabled}
      >
        Parse Tree
      </button>
    </div>
  );
}
