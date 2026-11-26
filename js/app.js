import {baseRun, date, history, sources, terms, topic} from '../data/sample.js';
import {costs, ledger, monitor, profile, reports, research, routes, settings, shell, users, welcome} from './views.js';

const root = document.querySelector('#root');
const drawer = document.querySelector('#ledger');
const key = 'radar-public-sample-v1';
const allSources = sources.map(([id])=>id);
const views = {research, monitor, costs, reports, users, settings, profile};

function storedState() {
  try { return JSON.parse(localStorage.getItem(key)) || {}; }
  catch { return {}; }
}
const saved = storedState();
const state = {
  entered: saved.entered === true,
  currency: saved.currency === 'USD' ? 'USD' : 'IDR',
  theme: saved.theme === 'light' ? 'light' : 'dark',
  saved: Array.isArray(saved.runs) ? [baseRun,...saved.runs] : [baseRun],
  active: null, pending: null, tags: [...terms], enabledSources: [...allSources],
  fuel: baseRun.cap, depth:'Investigate', source:'all', sort:'new', page:1,
  issue:'flood', language:'en', reportPage:3, error:'',
};

function persist() {
  const {entered, currency, theme} = state;
  try { localStorage.setItem(key, JSON.stringify({entered,currency,theme,runs:state.saved.slice(1)})); }
  catch { /* The current tab still works when browser storage is unavailable. */ }
}
function route() {
  const hash = location.hash.slice(1);
  return state.entered ? (Object.hasOwn(routes,hash) ? hash : 'research') : 'login';
}
function render() {
  const page = route();
  document.documentElement.dataset.theme = state.theme;
  root.innerHTML = page === 'login' ? welcome(state.theme) : shell(state,page,views[page](state));
  document.title = (page==='login'?'Sign in':routes[page][0]) + ' | RADAR';
}
function navigate(page) {
  const hash = page === 'login' ? '' : `#${page}`;
  if (hash !== location.hash) location.hash = hash;
  else render();
}
function update(target = '') {
  render();
  if (target) document.querySelector(target)?.scrollIntoView({block:'start'});
}
function setActive(id) {
  state.active = id;
  state.pending = null;
  state.source = 'all';
  state.sort = 'new';
  state.page = 1;
}
function plan() {
  if (!state.enabledSources.length || state.fuel < 300) {
    state.error = 'Select at least one source and set sample fuel of at least Rp 300.';
    update('#research-error');
    return;
  }
  state.error = '';
  const first = state.tags[0];
  state.pending = {topic:first && first!==terms[0] ? first : topic, depth:state.depth, cap:state.fuel, sources:[...state.enabledSources]};
  update('#planCard');
}
function run() {
  if (!state.pending) return;
  const id = `DEMO-310318-${String(state.saved.length+1).padStart(4,'0')}`;
  const generated = {
    ...state.pending, id, spent:Math.min(state.pending.cap, state.pending.sources.length*1440),
    time:`${date.slice(0,6)} 12:${String(state.saved.length%60).padStart(2,'0')}`, kind:'Sample', status:'Complete', owner:'Demo Analyst',
  };
  state.saved.push(generated);
  setActive(id);
  persist();
  update('#runCard');
}

root.addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const {action,value} = control.dataset;
  event.preventDefault();
  switch (action) {
    case 'enter': state.entered = true; persist(); navigate('research'); return;
    case 'signout': state.entered = false; setActive(null); persist(); navigate('login'); return;
    case 'theme': state.theme = state.theme === 'dark' ? 'light' : 'dark'; persist(); break;
    case 'currency': state.currency = value; persist(); break;
    case 'remove-tag': state.tags.splice(Number(value),1); break;
    case 'all-sources': state.enabledSources = [...allSources]; break;
    case 'source':
      state.enabledSources = state.enabledSources.includes(value) ? state.enabledSources.filter(id=>id!==value) : [...state.enabledSources,value];
      break;
    case 'depth': state.depth = value; state.fuel = {Scan:18000,Investigate:96000,'Deep dive':192000}[value]; break;
    case 'fuel': state.fuel = Number(value); break;
    case 'plan': plan(); return;
    case 'run': run(); return;
    case 'open': setActive(value); update('#runCard'); return;
    case 'new': setActive(null); update('#composer'); return;
    case 'filter': state.source = value; state.page = 1; break;
    case 'sort': state.sort = value; state.page = 1; break;
    case 'page': state.page = Number(value); update('#feedStat'); return;
    case 'issue': state.issue = value; break;
    case 'report-page': state.reportPage = Number(value); break;
    case 'ledger': {
      const selected = [...state.saved,...history].find(item=>item.id===value);
      if (!selected) return;
      drawer.innerHTML = ledger(selected,state.currency);
      drawer.showModal();
      return;
    }
    default: return;
  }
  const focus = `[data-action="${CSS.escape(action)}"][data-value="${CSS.escape(value)}"]`;
  render();
  root.querySelector(focus)?.focus({preventScroll:true});
});

drawer.addEventListener('click', event => {
  if (event.target.closest('[data-action="close-ledger"]')) drawer.close();
});
root.addEventListener('change', event => {
  if (event.target.id === 'rLang') { state.language = event.target.value; render(); }
});
root.addEventListener('input', event => {
  if (event.target.id === 'fuel') state.fuel = Math.max(0,Math.min(1000000, Math.floor(Number(event.target.value.replaceAll(',',''))) || 0));
});
root.addEventListener('keydown', event => {
  if (event.target.id !== 'keyword' || event.key !== 'Enter') return;
  const value = event.target.value.trim();
  if (!value || state.tags.includes(value) || state.tags.length >= 8) return;
  state.tags.push(value);
  render();
  root.querySelector('#keyword').focus();
});
window.addEventListener('hashchange', () => {
  if (drawer.open) drawer.close();
  render();
  window.scrollTo(0,0);
});
render();
