import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CodeEditor } from '$components/code-editor/code-editor';
import clearAllMocks = jest.clearAllMocks;

describe('CodeEditor', () => {
  const mockWorker: Worker = {
    postMessage: jest.fn(),
    terminate: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    onmessage: jest.fn(),
    onerror: jest.fn(),
    onmessageerror: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  beforeEach(() => {
    global.Worker = jest.fn(() => mockWorker);
  });

  afterEach(() => {
    clearAllMocks();
  });

  test('renders code editor with initial value', () => {
    const initialValue = 'console.log("Hello, world!");';
    const handleValueChange = jest.fn();

    render(<CodeEditor value={initialValue} onValueChange={handleValueChange} />);

    const editor = screen.getAllByRole('textbox')[0] as HTMLTextAreaElement;
    expect(editor).toBeInTheDocument();
    expect(editor.value).toBe(initialValue);
  });

  test('calls onValueChange when code editor value changes', () => {
    const initialValue = 'console.log("Hello, world!");';
    const handleValueChange = jest.fn();

    render(<CodeEditor value={initialValue} onValueChange={handleValueChange} />);

    const editor = screen.getAllByRole('textbox')[0] as HTMLTextAreaElement;
    const newValue = 'console.log("Updated code!");';

    fireEvent.input(editor, { target: { value: newValue } });

    expect(handleValueChange).toHaveBeenCalledWith(newValue);
  });
});
