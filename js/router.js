export const pages = {
  research: ['Live research', 'Build a research plan and explore simulated coverage.'],
  monitor: ['Monitor', 'Review tracked issues, sentiment and sample collectors.'],
  costs: ['Runs & costs', 'Track simulated usage and adjust budget limits.'],
  reports: ['Reports', 'Review a prepared issue brief and its fictional evidence.'],
  users: ['Users', 'Manage fictional people and review local role changes.'],
  settings: ['Settings', 'Manage sample sources, budgets and organisation profiles.'],
  profile: ['Profile', 'Review the demo account and its activity.'],
};

export function readRoute(entered) {
  const route = window.location.hash.slice(1);
  if (!entered) return 'welcome';
  return Object.hasOwn(pages, route) ? route : 'research';
}

export function navigate(route) {
  if (window.location.hash !== '#' + route) window.location.hash = route;
}
