import { Autocomplete, AutocompleteProps } from '$components/autocomplete/autocomplete.component';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';

jest.useFakeTimers();

describe('Autocomplete', () => {
  let defaultProps: AutocompleteProps = {
    caretData: {
      index: 5,
      position: { x: 2, y: 3 },
    },
    keywords: ['apple', 'banana', 'cherry'],
    code: 'const fruits = "apple";',
    onSuggestionAccept: jest.fn(),
  };

  const renderModal = (updatedProps: Partial<AutocompleteProps> = {}): RenderResult => {
    const renderResult = render(<Autocomplete {...defaultProps} />);
    const { rerender } = renderResult;

    rerender(
      <Autocomplete
        {...{
          ...defaultProps,
          caretData: {
            position: {
              x: 3,
              y: 0,
            },
            index: 3,
          },
          code: 'app',
          ...updatedProps,
        }}
      />,
    );

    return renderResult;
  };

  beforeEach(() => {
    const { getByTestId } = render(<textarea data-testid="ti-textarea" />);
    const textAreaElement = getByTestId('ti-textarea') as HTMLTextAreaElement;

    defaultProps = {
      ...defaultProps,
      textAreaElement,
    };
  });

  it('should render the component without suggestions and hidden modal', () => {
    const { queryByTestId, queryAllByTestId } = render(<Autocomplete {...defaultProps} />);

    const modalElement = queryByTestId('ti-autocomplete-modal');
    const suggestionElements = queryAllByTestId(/^ti-autocomplete-option-/);

    expect(modalElement).toBeInTheDocument();
    expect(modalElement?.hidden).toBeTruthy();
    expect(suggestionElements).toHaveLength(0);
  });

  it('should render the component with suggestions and visible modal', () => {
    const { queryByTestId, queryAllByTestId } = renderModal();

    act(() => jest.advanceTimersByTime(200));

    const modalElement = queryByTestId('ti-autocomplete-modal');
    const suggestionElements = queryAllByTestId(/^ti-autocomplete-option-/);

    expect(modalElement).toBeInTheDocument();
    expect(suggestionElements).toHaveLength(1);
  });

  it('should handle option click', () => {
    const { getAllByTestId } = renderModal();

    act(() => jest.advanceTimersByTime(200));

    const suggestionElements = getAllByTestId(/^ti-autocomplete-option-/);

    fireEvent.click(suggestionElements[0]);

    expect(defaultProps.onSuggestionAccept).toHaveBeenCalledWith(defaultProps.keywords[0], expect.any(Object));
  });

  it('should call onSuggestionAccept when Enter key is pressed', () => {
    const { getByText } = renderModal();

    act(() => jest.advanceTimersByTime(200));

    const suggestionElement = getByText('apple');
    fireEvent.keyDown(suggestionElement, { key: 'Enter' });

    expect(defaultProps.onSuggestionAccept).toHaveBeenCalledWith('apple', {
      startIndex: 0,
      length: 3,
    });
  });

  it('should handle Arrow Up key press', () => {
    const { getAllByTestId } = renderModal({ keywords: [...defaultProps.keywords, 'apple1', 'apple2'] });

    act(() => jest.advanceTimersByTime(200));

    const suggestionElements = getAllByTestId(/^ti-autocomplete-option-/);
    const option1 = suggestionElements[0];
    const option2 = suggestionElements[1];
    const option3 = suggestionElements[2];

    expect(option1).toHaveClass('autocompleteModalSelectedElement');
    expect(option2).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option3).not.toHaveClass('autocompleteModalSelectedElement');

    fireEvent.keyDown(document, { key: 'ArrowUp' });

    expect(option1).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option2).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option3).toHaveClass('autocompleteModalSelectedElement');

    fireEvent.keyDown(document, { key: 'ArrowUp' });

    expect(option1).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option2).toHaveClass('autocompleteModalSelectedElement');
    expect(option3).not.toHaveClass('autocompleteModalSelectedElement');
  });

  it('should handle Arrow Down key press', () => {
    const { getAllByTestId } = renderModal({ keywords: [...defaultProps.keywords, 'apple1', 'apple2'] });

    act(() => jest.advanceTimersByTime(200));

    const suggestionElements = getAllByTestId(/^ti-autocomplete-option-/);
    const option1 = suggestionElements[0];
    const option2 = suggestionElements[1];
    const option3 = suggestionElements[2];

    expect(option1).toHaveClass('autocompleteModalSelectedElement');
    expect(option2).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option3).not.toHaveClass('autocompleteModalSelectedElement');

    fireEvent.keyDown(document, { key: 'ArrowDown' });

    expect(option1).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option2).toHaveClass('autocompleteModalSelectedElement');
    expect(option3).not.toHaveClass('autocompleteModalSelectedElement');

    fireEvent.keyDown(document, { key: 'ArrowDown' });

    expect(option1).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option2).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option3).toHaveClass('autocompleteModalSelectedElement');

    fireEvent.keyDown(document, { key: 'ArrowDown' });

    expect(option1).toHaveClass('autocompleteModalSelectedElement');
    expect(option2).not.toHaveClass('autocompleteModalSelectedElement');
    expect(option3).not.toHaveClass('autocompleteModalSelectedElement');
  });

  it('should hide the modal on Escape key press', () => {
    const { getByTestId } = renderModal();
    const modalElement = getByTestId('ti-autocomplete-modal');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(modalElement).not.toBeVisible();
  });

  it('should show the modal when Ctrl + Enter keys are pressed', () => {
    const { getAllByTestId, getByTestId } = renderModal();
    const modalElement = getByTestId('ti-autocomplete-modal');

    act(() => jest.advanceTimersByTime(200));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(modalElement).not.toBeVisible();

    fireEvent.keyDown(document, { key: 'Enter', ctrlKey: true });

    const suggestionElements = getAllByTestId(/^ti-autocomplete-option-/);

    expect(modalElement).toBeInTheDocument();
    expect(suggestionElements).toHaveLength(1);
  });

  it('should calculate the modal position correctly', () => {
    const textAreaElement = defaultProps.textAreaElement;
    const textAreaParentElement = textAreaElement?.parentElement ?? undefined;

    if (textAreaElement === undefined || textAreaParentElement === undefined) {
      throw new Error('Textarea is not created while playing scenario');
    }

    const mockedBoundingBox = {
      top: 100,
      left: 200,
    };

    textAreaParentElement.style.position = 'relative';
    textAreaElement.style.position = 'absolute';
    textAreaElement.style.top = `${mockedBoundingBox.top}px`;
    textAreaElement.style.left = `${mockedBoundingBox.left}px`;

    jest.spyOn(textAreaElement, 'getBoundingClientRect').mockReturnValue(mockedBoundingBox as DOMRect);

    const { getByTestId } = renderModal();

    const modalElement = getByTestId('ti-autocomplete-modal');

    expect(modalElement).toHaveStyle('top: calc(160px + 10px)');
    expect(modalElement).toHaveStyle('left: calc(200px + 60px)');
  });

  it('should remove event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderModal();

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should not show modal when typed word has length lesser or equals 1', () => {
    const { getByTestId, rerender } = renderModal({
      code: 'apple a',
      caretData: { position: { x: 7, y: 0 }, index: 7 },
    });

    act(() => jest.advanceTimersByTime(200));

    const modalElement = getByTestId('ti-autocomplete-modal');

    expect(modalElement).not.toBeVisible();

    rerender(
      <Autocomplete {...{ ...defaultProps, code: 'apple ap', caretData: { position: { x: 8, y: 0 }, index: 8 } }} />,
    );

    act(() => jest.advanceTimersByTime(200));

    expect(modalElement).toBeVisible();
  });

  it('should not perform suggestions search after option selection', () => {
    const { getByTestId, getAllByTestId, rerender } = renderModal();

    act(() => jest.advanceTimersByTime(200));

    jest.spyOn(defaultProps, 'onSuggestionAccept').mockImplementation(() => {
      rerender(
        <Autocomplete {...{ ...defaultProps, code: 'apple ', caretData: { position: { x: 6, y: 0 }, index: 6 } }} />,
      );
    });

    const modalElement = getByTestId('ti-autocomplete-modal');
    const suggestionElements = getAllByTestId(/^ti-autocomplete-option-/);

    expect(modalElement).toBeVisible();

    fireEvent.click(suggestionElements[0]);

    act(() => jest.advanceTimersByTime(200));

    expect(modalElement).not.toBeVisible();
    expect(defaultProps.textAreaElement).toHaveFocus();
  });
});
