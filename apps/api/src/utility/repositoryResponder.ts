export type TRepositoryResponderCallback<T> = () => Promise<T>;
export type TRepositoryResponder<T> = {
  data: null,
  error: Error,
} | {
  data: T,
  error: null,
};

export async function repositoryResponder<T>(callback: TRepositoryResponderCallback<T>): Promise<TRepositoryResponder<T>> {
  // Ez elvileg soha nem fordulhatna elő a TypeScript jelenléte miatt,
  // de mivel az csak build-time -ig van "jelen", és runtime -ban nincs,
  // így lehet létjogosultsága ilyesfajta extra védelemnek.
  if (typeof callback !== 'function') {
    return { data: null, error: new Error('Repository responder received an invalid callable parameter.') };
  }

  try {
    const result = await callback();
    return { data: result as T, error: null } satisfies TRepositoryResponder<T>;
  }
  catch (e: unknown) {
    let error: Error = new Error('An unknown error has occurred.');

    if (e instanceof Error) {
      error = e;
    }
    else if (typeof e === 'string') {
      error = new Error(e);
    }

    return { data: null, error };
  }
};
