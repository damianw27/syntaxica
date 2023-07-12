import { cleanup, render, act } from '@testing-library/react';
import React, { useEffect } from 'react';
import { WorkerInfo } from '@syntaxica/lib';
import { useParsing } from '$hooks/parsing/parsing';

describe('useParsing', () => {
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

  const exampleWorkerInfo: WorkerInfo = { name: 'worker', versions: [{ name: 'latest', url: 'https://test.pl' }] };

  beforeAll(() => {
    global.Worker = jest.fn(() => mockWorker);
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  interface TestComponentProps {
    readonly text: string;
    readonly workerInfo: WorkerInfo;
    readonly onRender: (hookResult: ReturnType<typeof useParsing>) => void;
  }

  function TestComponent({ text, workerInfo, onRender }: TestComponentProps) {
    const hookValues = useParsing(text, workerInfo);
    useEffect(() => {
      onRender(hookValues);
    }, [hookValues, onRender]);
    return null;
  }

  it('initializes with isParsing and isInitializing set to false', () => {
    const onRender = jest.fn();
    render(<TestComponent text="sample text" workerInfo={exampleWorkerInfo} onRender={onRender} />);
    expect(onRender).toHaveBeenNthCalledWith(1, expect.objectContaining({ isParsing: false, isInitializing: false }));
  });

  it('sets isInitializing to true when initializing the worker', () => {
    render(<TestComponent text="sample text" workerInfo={exampleWorkerInfo} onRender={() => {}} />);
    act(() => {
      if (mockWorker!.onmessage === null) {
        throw new Error('mock cannot be null!');
      }

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      mockWorker.onmessage({ data: 'initialization data' } as MessageEvent);
    });
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ type: 'grammar/initialize' });
  });

  it('sets isParsing to true when parsing starts', async () => {
    const onRender = jest.fn();
    render(<TestComponent text="sample text" workerInfo={exampleWorkerInfo} onRender={onRender} />);

    act(() => {
      if (mockWorker!.onmessage === null) {
        throw new Error('mock cannot be null!');
      }

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      mockWorker.onmessage({ data: 'initialization data' } as MessageEvent);
    });

    act(() => {
      if (mockWorker!.onmessage === null) {
        throw new Error('mock cannot be null!');
      }

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      mockWorker.onmessage({ data: { parseResult: 'parsing data' } } as MessageEvent);
    });

    const expectedObject = { isInitializing: false, isParsing: true, specification: { parseResult: 'parsing data' } };
    expect(onRender).toHaveBeenLastCalledWith(expect.objectContaining(expectedObject));
  });

  it('sets parsingData correctly on parse response', async () => {
    const onRender = jest.fn();
    render(<TestComponent text="sample text" workerInfo={exampleWorkerInfo} onRender={onRender} />);

    act(() => {
      if (mockWorker!.onmessage === null) {
        throw new Error('mock cannot be null!');
      }

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      mockWorker.onmessage({ data: 'initialization data' } as MessageEvent);
    });

    act(() => {
      if (mockWorker!.onmessage === null) {
        throw new Error('mock cannot be null!');
      }

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      mockWorker.onmessage({ data: { parseResult: 'parsing data' } } as MessageEvent);
    });

    const expectedObject = { isInitializing: false, isParsing: true, specification: { parseResult: 'parsing data' } };
    expect(onRender).toHaveBeenLastCalledWith(expect.objectContaining(expectedObject));
  });

  it('terminates worker on unmount', () => {
    const { unmount } = render(<TestComponent text="sample text" workerInfo={exampleWorkerInfo} onRender={() => {}} />);
    unmount();
    expect(mockWorker.terminate).toHaveBeenCalled();
  });
});
