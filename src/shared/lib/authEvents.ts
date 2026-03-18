type AuthEvent = 'unauthorized';

type Listener = () => void;

const listeners = new Map<AuthEvent, Set<Listener>>();

export const authEvents = {
  emit(event: AuthEvent) {
    listeners.get(event)?.forEach((listener) => listener());
  },
  subscribe(event: AuthEvent, listener: Listener) {
    const bucket = listeners.get(event) ?? new Set<Listener>();
    bucket.add(listener);
    listeners.set(event, bucket);

    return () => {
      bucket.delete(listener);
      if (bucket.size === 0) {
        listeners.delete(event);
      }
    };
  },
};
