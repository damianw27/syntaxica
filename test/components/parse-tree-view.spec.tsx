import { render } from '@testing-library/react';
import React from 'react';
import { Network } from 'vis-network';
import { isTreeRuleNode, isTreeTerminalNode, ParseTree } from '@syntaxica/lib';
import { ParseTreeView } from '$components/parse-tree/parse-tree-view';
import clearAllMocks = jest.clearAllMocks;

jest.mock('@gql-grammar/worker');

const mockedNetwork = {
  destroy: jest.fn(),
  fit: jest.fn(),
  redraw: jest.fn(),
};

jest.mock('vis-network', () => ({
  Network: jest.fn().mockImplementation(() => mockedNetwork),
}));

const mockedIsTreeRuleNode = isTreeRuleNode as jest.MockedFunction<typeof isTreeRuleNode>;
const mockedIsTreeTerminalNode = isTreeTerminalNode as jest.MockedFunction<typeof isTreeTerminalNode>;

describe('ParseTreeView', () => {
  const mockData: ParseTree = [
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

  afterEach(() => clearAllMocks());

  it('should render without crashing', () => {
    render(<ParseTreeView isParsing={false} parseTree={mockData} />);
  });

  it('should render the loading state', () => {
    const { getByTestId } = render(<ParseTreeView isParsing parseTree={[]} />);
    const loadingIcon = getByTestId('ti-loading-parse-tree');
    expect(loadingIcon).toBeInTheDocument();
  });

  it('should render the parse tree container when not loading', () => {
    const { getByTestId } = render(<ParseTreeView isParsing={false} parseTree={mockData} />);
    const container = getByTestId('ti-parse-tree--container');
    expect(container).toBeInTheDocument();
    expect(container).not.toHaveAttribute('style', 'display: none');
  });

  it('should do nothing if edges are empty', () => {
    const exampleParseTree: ParseTree = [
      {
        name: 'test2',
        text: 'Test 2',
        type: 1,
      },
    ];

    render(<ParseTreeView isParsing={false} parseTree={exampleParseTree} />);
    expect(Network).toHaveBeenCalledTimes(2);
  });

  it('should do nothing if nodes are empty', () => {
    const exampleParseTree: ParseTree = [];
    render(<ParseTreeView isParsing={false} parseTree={exampleParseTree} />);
    expect(Network).toHaveBeenCalledTimes(2);
  });

  it('should render network while provided valid input', async () => {
    const { getByTestId } = render(<ParseTreeView isParsing={false} parseTree={mockData} />);
    const container = getByTestId('ti-parse-tree--container');
    expect(container.hidden).toBeFalsy();
  });

  it('should call isTreeRuleNode and isTreeTerminalNode correctly', () => {
    render(<ParseTreeView isParsing={false} parseTree={mockData} />);
    expect(mockedIsTreeRuleNode).toHaveBeenCalled();
    expect(mockedIsTreeTerminalNode).toHaveBeenCalled();
  });

  it('should render spinner while parse process is ongoing', () => {
    const { getByTestId } = render(<ParseTreeView isParsing parseTree={mockData} />);
    expect(getByTestId('ti-loading-parse-tree')).toBeInTheDocument();
  });

  it('should initialize and destroy Network when parse tree data changes', () => {
    const { unmount } = render(<ParseTreeView isParsing={false} parseTree={mockData} />);

    unmount();

    expect(Network).toHaveBeenCalledTimes(2);
    expect(mockedNetwork.destroy).toHaveBeenCalledTimes(3);
    expect(mockedNetwork.fit).toHaveBeenCalledTimes(2);
    expect(mockedNetwork.redraw).toHaveBeenCalledTimes(2);
  });

  it('should not create parse tree view when container is removed', () => {
    const { getByTestId } = render(<ParseTreeView isParsing={false} parseTree={mockData} />);

    expect(Network).toHaveBeenCalledTimes(2);

    const container = getByTestId('ti-parse-tree--container');
    container.remove();

    expect(Network).toHaveBeenCalledTimes(2);
  });
});
