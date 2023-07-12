import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ViewSelect } from '$components/view-select/view-select';
import { CodeEditorViewType } from '$components/code-editor/types/code-editor-view-type';

describe('ViewSelect', () => {
  let onViewSelectChangeMock: jest.Mock;

  beforeEach(() => {
    onViewSelectChangeMock = jest.fn();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(
      <ViewSelect
        value={CodeEditorViewType.Editor}
        isParseTreeViewDisabled={false}
        onViewSelectChange={onViewSelectChangeMock}
      />,
    );
    expect(getByTestId('ti-view-select--wrapper')).toBeInTheDocument();
  });

  it('calls onViewSelectChange with correct value when buttons are clicked', () => {
    const { getByTestId } = render(
      <ViewSelect
        value={CodeEditorViewType.Editor}
        isParseTreeViewDisabled={false}
        onViewSelectChange={onViewSelectChangeMock}
      />,
    );

    fireEvent.click(getByTestId('ti-view-select--editor-button'));
    expect(onViewSelectChangeMock).toHaveBeenCalledWith(CodeEditorViewType.Editor);

    fireEvent.click(getByTestId('ti-view-select--wrapper--parse-tree'));
    expect(onViewSelectChangeMock).toHaveBeenCalledWith(CodeEditorViewType.ParseTree);
  });

  it('changes className based on selected view', () => {
    const { getByTestId, rerender } = render(
      <ViewSelect
        value={CodeEditorViewType.Editor}
        isParseTreeViewDisabled={false}
        onViewSelectChange={onViewSelectChangeMock}
      />,
    );
    expect(getByTestId('ti-view-select--editor-button').className).toContain('selectedOption');

    rerender(
      <ViewSelect
        value={CodeEditorViewType.ParseTree}
        isParseTreeViewDisabled={false}
        onViewSelectChange={onViewSelectChangeMock}
      />,
    );
    expect(getByTestId('ti-view-select--wrapper--parse-tree').className).toContain('selectedOption');
  });
});
