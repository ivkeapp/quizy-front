import { useEffect } from 'react';
import { useBeforeUnload } from 'react-router-dom';

export function useQuizLeaveGuard(when: boolean) {
  useBeforeUnload(
    (event) => {
      if (!when) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    },
    { capture: true },
  );

  useEffect(() => {
    if (!when) {
      return;
    }

    const handlePopState = () => {
      const shouldLeave = window.confirm('You have an active quiz session. Leave this page?');

      if (!shouldLeave) {
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [when]);
}
