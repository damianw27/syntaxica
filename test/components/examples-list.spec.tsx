import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExamplesList } from '$components/examples-list/examples-list';
import spyOn = jest.spyOn;

const mockGrammar = {};

const mockExamples = [
  {
    name: 'Example Title',
    code: 'const test = "example string";',
  },
  {
    name: 'Some fancy name',
    code: 'const test = 2;',
  },
  {
    name: '3',
    code: 'const test = "31f7a8asda777ssa866";',
  },
];

describe('ExamplesList', () => {
  beforeEach(() => {
    spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  it('renders the ExamplesList component with a search input and example list', () => {
    render(<ExamplesList isLoading={false} grammar={mockGrammar} examples={mockExamples} onExampleClick={jest.fn()} />);

    const examplesList = screen.getByRole('list');
    expect(examplesList).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();

    const exampleElements = screen.getAllByRole('listitem');
    expect(exampleElements.length).toBe(mockExamples.length);
  });

  it('filters the example list based on search input', async () => {
    render(<ExamplesList isLoading={false} grammar={mockGrammar} examples={mockExamples} onExampleClick={jest.fn()} />);

    const searchInput = screen.getByPlaceholderText('Search...');

    fireEvent.change(searchInput, { target: { value: 'Some fancy name' } });

    await waitFor(() => {
      const filteredExampleElements = screen.getAllByRole('listitem');
      expect(filteredExampleElements.length).toBe(1);
    });

    fireEvent.change(searchInput, { target: { value: '"31f7a8asda777ssa866"' } });

    await waitFor(() => {
      const filteredExampleElements = screen.getAllByRole('listitem');
      expect(filteredExampleElements.length).toBe(1);
    });

    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      const exampleElements = screen.getAllByRole('listitem');
      expect(exampleElements.length).toBe(mockExamples.length);
    });
  });

  it('calls the onExampleClick callback when an example is clicked', () => {
    const mockOnExampleClick = jest.fn();

    render(
      <ExamplesList
        isLoading={false}
        grammar={mockGrammar}
        examples={mockExamples}
        onExampleClick={mockOnExampleClick}
      />,
    );

    const exampleElement = screen.getByText('Example Title');

    fireEvent.click(exampleElement);

    expect(mockOnExampleClick).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'const test = "example string";', name: 'Example Title' }),
    );
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
