import { useCallback, useState } from 'react';

export type Status = 'initial' | 'loading' | 'success' | 'error';

// TODO is this ever used?
export function useAsyncCall<ReturnValue>(cb: (...args: any[]) => Promise<ReturnValue>) {
  const [_status, _setStatus] = useState<Status>('initial');
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(
    (...args: any[]) => {
      cb(...args)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          setError(err);
        });
    },
    [cb]
  );

  return {
    call,
    error
  };
}
