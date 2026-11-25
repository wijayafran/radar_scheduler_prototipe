const storageKey = 'radar-prototype-v1';

export function initialState() {
  return {
    entered: false, currency: 'IDR', history: [], saved: [], paused: [], caps: {},
    workspaceCap: null, addedIssues: [], alerts: {}, collections: {}, people: {},
    audit: [], organisations: [], interval: 180, lastSync: false,
    report: { language: 'en', audience: 'Leadership', checks: [] },
  };
}

export function createStore() {
  let state = initialState();
  let available = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      for (const key of Object.keys(state)) {
        if (Object.hasOwn(saved, key)) state[key] = saved[key];
      }
    }
  } catch {
    available = false;
  }

  return {
    get value() { return state; },
    get available() { return available; },
    update(action) {
      action(state);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        available = false;
      }
    },
    reset() {
      state = initialState();
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        available = false;
      }
    },
  };
}
