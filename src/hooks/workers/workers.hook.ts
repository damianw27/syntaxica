import { WorkerInfo } from '@syntaxica/lib';
import { useEffect, useState } from 'react';

const workersDataLink = 'https://damianw27.github.io/syntaxica-workers/workers.json';

interface UseWorkers {
  readonly isLoading: boolean;
  readonly workers: WorkerInfo[];
}

export function useWorkers(): UseWorkers {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workers, setWorkers] = useState<WorkerInfo[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await fetch(workersDataLink);
      const receivedWorkers = (await response.json()) as WorkerInfo[];
      console.log(receivedWorkers);
      setWorkers(receivedWorkers);
      setIsLoading(false);
    })();
  }, []);

  return { isLoading, workers };
}
