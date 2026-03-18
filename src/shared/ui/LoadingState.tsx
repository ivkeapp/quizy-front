import { Loader } from './Loader';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <Loader label={label} />;
}
