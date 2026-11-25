export async function loadDemo() {
  const response = await fetch(new URL('../data/demo.json', import.meta.url));
  if (!response.ok) throw new Error('Sample data could not be loaded.');
  return response.json();
}

export function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

export function amount(run) {
  return sum(Object.values(run.costs));
}

export function history(data, state) {
  return [...data.history, ...state.history];
}

export function totals(data, state) {
  const rows = history(data, state);
  const sources = Object.fromEntries(data.sources.map(source => [
    source.id, sum(rows.map(run => run.costs[source.id] ?? 0)),
  ]));
  return { sources, month: sum(Object.values(sources)) };
}

export function money(value, currency, exchange) {
  return currency === 'USD'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / exchange)
    : 'Rp ' + new Intl.NumberFormat('en-US').format(value);
}

export function safeTopics(data, keywords) {
  const approved = data.topics.filter(topic =>
    keywords.some(word => word.toLowerCase() === topic.toLowerCase()));
  return keywords.length > approved.length ? [...approved, 'Custom sample topic'] : approved;
}

export function createPlan(data, state, draft) {
  const depth = data.depths.find(option => option.id === draft.depth);
  const spent = totals(data, state);
  let remaining = Math.max(0, Math.min(draft.fuel, (state.workspaceCap ?? data.monthlyCap) - spent.month));
  const social = data.sources.filter(source => draft.sources.includes(source.id) && source.id !== 'news' && !state.paused.includes(source.id));
  const costs = {};
  const rounds = {};
  for (let round = 0; round < depth.rounds; round++) {
    for (const source of social) {
      const current = costs[source.id] ?? 0;
      const cap = state.caps[source.id] ?? source.cap;
      if (source.price > remaining || current + source.price > cap - spent.sources[source.id]) continue;
      remaining -= source.price;
      costs[source.id] = current + source.price;
      rounds[source.id] = (rounds[source.id] ?? 0) + 1;
    }
  }
  if (draft.news && !state.paused.includes('news')) rounds.news = 1;
  return { depth: depth.id, topics: safeTopics(data, draft.keywords), rounds, costs, fuel: draft.fuel };
}

function hash(text) {
  return Array.from(text).reduce((value, char) => (Math.imul(value, 31) + char.codePointAt(0)) >>> 0, 0);
}

export function resultsFor(data, plan) {
  const seed = hash(plan.topics.join('|') + plan.depth);
  return Object.entries(plan.rounds).flatMap(([source, rounds], index) => {
    const pool = source === 'news' ? data.news : data.results;
    return Array.from({ length: rounds * 2 }, (_, row) => ({
      ...pool[(seed + index * 3 + row) % pool.length],
      source,
      reach: 350 + ((seed + index * 53 + row * 1237) % 4800),
    }));
  });
}

export function spendingSeries(data, state) {
  const rows = history(data, state);
  return Array.from({ length: 18 }, (_, i) => {
    const date = data.demoDay.slice(0, 8) + String(i + 1).padStart(2, '0');
    return sum(rows.filter(run => run.day === date).map(amount));
  });
}
