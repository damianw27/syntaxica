import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { WorkerInfo } from '@syntaxica/lib';
import { WorkerSelect } from '$components/worker-select/worker-select';

const exampleWorkerInfo0: WorkerInfo = { name: 'worker0', versions: [{ name: 'latest', url: 'https://test0.pl' }] };
const exampleWorkerInfo1: WorkerInfo = { name: 'worker1', versions: [{ name: 'latest', url: 'https://test1.pl' }] };
const availableWorkers: WorkerInfo[] = [exampleWorkerInfo0, exampleWorkerInfo1];

describe('WorkerSelect', () => {
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  it('should render the select element with given value', () => {
    const workerInfo: WorkerInfo = availableWorkers[0];

    const { getByTestId } = render(
      <WorkerSelect value={workerInfo} onChange={mockOnChange} workers={availableWorkers} />,
    );

    const selectElement = getByTestId('ti-worker-select') as HTMLSelectElement;

    expect(selectElement.value).toBe(workerInfo.versions[0].url);
  });

  it('should render the correct number of options', () => {
    const workerInfo: WorkerInfo = availableWorkers[0];

    const { getAllByTestId } = render(
      <WorkerSelect value={workerInfo} onChange={mockOnChange} workers={availableWorkers} />,
    );

    const options = getAllByTestId('ti-worker-select--option');

    expect(options.length).toBe(availableWorkers.length);
  });

  it('should call onChange with the selected worker info when an option is selected', () => {
    const workerInfo: WorkerInfo = availableWorkers[0];

    const { getByTestId } = render(
      <WorkerSelect value={workerInfo} onChange={mockOnChange} workers={availableWorkers} />,
    );

    const selectElement = getByTestId('ti-worker-select') as HTMLSelectElement;
    fireEvent.change(selectElement, { target: { value: availableWorkers[1].versions[0].url } });

    expect(mockOnChange).toHaveBeenCalledWith(availableWorkers[1]);
  });

  it('should call onChange with the first worker info when an invalid option is selected', () => {
    const workerInfo: WorkerInfo = availableWorkers[0];

    const { getByTestId } = render(
      <WorkerSelect value={workerInfo} onChange={mockOnChange} workers={availableWorkers} />,
    );

    const selectElement = getByTestId('ti-worker-select') as HTMLSelectElement;
    fireEvent.change(selectElement, { target: { value: 'non-existent-file-name' } });

    expect(mockOnChange).toHaveBeenCalledWith(availableWorkers[0]);
  });
});
