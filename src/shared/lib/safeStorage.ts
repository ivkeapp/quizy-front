type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear'>;

function getStorage(): StorageLike | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storage = window.localStorage as unknown;
    if (
      typeof storage === 'object' &&
      storage !== null &&
      'getItem' in storage &&
      typeof (storage as Storage).getItem === 'function'
    ) {
      return storage as Storage;
    }
  }

  return null;
}

export const safeStorage = {
  getItem(key: string): string | null {
    const storage = getStorage();
    if (!storage) {
      return null;
    }
    return storage.getItem(key);
  },
  setItem(key: string, value: string) {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.setItem(key, value);
  },
  removeItem(key: string) {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.removeItem(key);
  },
  clear() {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.clear();
  },
};
