import React from 'react';
import { WorkerInfo } from '@syntaxica/lib';
import css from '$components/worker-select/worker-select.module.css';

interface WorkerSelectProps {
  readonly value?: WorkerInfo;
  readonly workers: WorkerInfo[];
  readonly onChange: (info: WorkerInfo) => void;
}

export function WorkerSelect({ value, workers, onChange }: WorkerSelectProps) {
  const getOptions = () =>
    workers.map((worker, index) => (
      <option
        className={css.selectOption}
        key={`worker-options-${index + 1}`}
        value={worker.versions[0].name}
        data-testid="ti-worker-select--option"
      >
        {value?.name ?? ''}
      </option>
    ));

  const getInfoByUrl = (url: string) => workers.find((worker) => worker.versions[0].url === url);

  return (
    <div className={css.selectWrapper} data-testid="ti-worker-select--wrapper">
      <select
        value={value?.versions[0]?.url ?? ''}
        onChange={(event) => onChange(getInfoByUrl(event.currentTarget?.value ?? '') ?? workers[0])}
        className={css.select}
        data-testid="ti-worker-select"
      >
        {getOptions()}
      </select>
    </div>
  );
}

WorkerSelect.defaultProps = {
  value: undefined,
};
