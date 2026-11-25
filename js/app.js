import { createStore } from './state.js';
import { navigate, pages, readRoute } from './router.js';
import { amount, createPlan, loadDemo, money, resultsFor } from './mock-api.js';
import { icons } from './charts.js';
import * as views from './views.js';

const root = document.querySelector('#root');
const dialog = document.querySelector('#dialog');
const notice = document.querySelector('#notice');
const store = createStore();
const esc = views.escape;
let data, draft, currentRun, running, flashTimer, dialogOrigin;
let selectedIssue = 'harbor', reportPart = 0, filter = 'all', menuOpen = false;

function newDraft() {
  return { keywords: [], keywordText: '', sources: ['tiktok', 'x', 'instagram', 'youtube'],
    news: true, depth: 'investigate', fuel: data.defaultFuel, fuelText: String(data.defaultFuel) };
}

function say(message) {
  clearTimeout(flashTimer);
  notice.textContent = message;
  notice.hidden = false;
  flashTimer = setTimeout(() => { notice.hidden = true; }, 3600);
}

function getRoute() {
  return readRoute(store.value.entered);
}

function render(focusTarget) {
  const route = getRoute();
  const active = document.activeElement;
  const control = active?.dataset.action
    ? '[data-action="' + CSS.escape(active.dataset.action) + '"][data-value="' + CSS.escape(active.dataset.value) + '"]'
    : active?.dataset.change ? '[data-change="' + CSS.escape(active.dataset.change) + '"]' : null;
  const s = store.value;
  const page = {
    research: () => views.research(data, s, draft, createPlan(data, s, draft), currentRun, running, filter),
    monitor: () => views.monitor(data, s, selectedIssue),
    costs: () => views.costs(data, s),
    reports: () => views.reports(data, s, reportPart),
    users: () => views.users(data, s),
    settings: () => views.settings(data, s),
    profile: () => views.profile(data, s),
  };
  root.innerHTML = route === 'welcome' ? views.welcome()
    : views.shell(data, s, route, page[route](), menuOpen, store.available);
  document.title = (pages[route]?.[0] ?? 'Demo sign-in') + ' | RADAR Prototype';
  if (running && route === 'research') drawProgress();
  const focus = focusTarget ?? control;
  if (focus && !dialog.open) root.querySelector(focus)?.focus({ preventScroll: !focusTarget });
}

function showDialog(title, body, submit, action, id = '') {
  const active = document.activeElement;
  dialogOrigin = active?.dataset.action
    ? '[data-action="' + CSS.escape(active.dataset.action) + '"][data-value="' + CSS.escape(active.dataset.value) + '"]'
    : '#main-content';
  dialog.innerHTML = `<form id="dialog-form" data-kind="${action}" data-id="${esc(id)}">
    <div class="dialog-head split"><h2 id="dialog-title">${title}</h2>${views.button(icons('close'), 'cancel', '', 'icon-button', 'aria-label="Close dialog"')}</div>
    <div class="dialog-body">${body}<p class="form-error" id="dialog-error" role="alert" hidden></p></div>
    <div class="dialog-footer">${views.button('Cancel', 'cancel')}<button class="button primary" type="submit">${submit}</button></div></form>`;
  dialog.showModal();
  dialog.querySelector('input, select, [data-action=cancel]')?.focus();
}

function fieldError(selector, message) {
  const element = document.querySelector(selector);
  element.hidden = false;
  element.textContent = message;
}

function drawProgress() {
  const bar = root.querySelector('#run-progress');
  if (!bar) return;
  const value = Math.min(100, Math.round((performance.now() - running.start) / 22));
  bar.value = value;
  root.querySelector('#run-percent').textContent = value + '%';
  root.querySelector('#run-stage').textContent =
    value < 30 ? 'Preparing sample sources' : value < 75 ? 'Replaying fictional coverage' : 'Assembling sample results';
}

function startRun() {
  const plan = createPlan(data, store.value, draft);
  if (!Object.keys(plan.rounds).length) return fieldError('#dialog-error', 'No source fits the current budget or source settings.');
  const id = 'DEMO-' + String(data.history.length + store.value.history.length + 1).padStart(3, '0');
  const run = { ...plan, id, day: data.demoDay, topic: plan.topics.join(' · '), results: resultsFor(data, plan) };
  dialog.close();
  currentRun = null;
  filter = 'all';
  running = { start: performance.now() };
  render('#run-outcome');
  running.tick = setInterval(drawProgress, 90);
  running.finish = setTimeout(() => {
    clearInterval(running.tick);
    running = null;
    const { costs, day, id, topic } = run;
    store.update(s => s.history.push({ costs, day, id, topic }));
    currentRun = run;
    if (getRoute() === 'research') render('#run-outcome');
    else render();
    say('Research complete. ' + run.results.length + ' sample results.');
  }, 2200);
}

function clearSession() {
  if (running) {
    clearInterval(running.tick);
    clearTimeout(running.finish);
    running = null;
  }
  draft = newDraft();
  currentRun = null;
  filter = 'all';
  selectedIssue = 'harbor';
  reportPart = 0;
  menuOpen = false;
}

function setToggle(values, item) {
  return values.includes(item) ? values.filter(value => value !== item) : [...values, item];
}

function addKeyword(word, clearInput = false) {
  word = word.trim();
  if (!word || draft.keywords.some(keyword => keyword.toLowerCase() === word.toLowerCase())) return;
  if (draft.keywords.length >= 8) return say('Use up to eight keywords.');
  draft.keywords.push(word);
  if (clearInput) draft.keywordText = '';
  render('[name=keyword]');
}

function editUser(id) {
  const directory = views.directory(data, store.value);
  const person = directory.find(item => item.id === id);
  const available = data.people.filter(item => !directory.some(listed => listed.id === item.id));
  if (!person && !available.length) return say('All fictional invitees are already in the directory.');
  const name = person ? '<p>' + esc(person.name) + ' · ' + esc(person.email) + '</p>'
    : `<label>Fictional invitee<select name="person" required>${available.map(item => views.option(item.id, item.name)).join('')}</select></label>`;
  showDialog(person ? 'Edit user' : 'Add user', name + `<label>Role<select name="role">
    ${['User','Admin'].map(role => views.option(role, role, person?.role)).join('')}</select></label>`
    + (person ? `<label>Status<select name="status">${views.option('active','Active',person.active ? 'active':'disabled')}
       ${views.option('disabled','Disabled',person.active ? 'active':'disabled')}</select></label>` : ''),
  person ? 'Save user' : 'Add fictional user', 'user', id);
}

root.addEventListener('click', event => {
  if (menuOpen && event.target.closest('#site-nav a')?.hash === window.location.hash) {
    menuOpen = false;
    render('#main-content');
    return;
  }
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const { action, value } = target.dataset;
  const state = store.value;
  switch (action) {
    case 'enter':
      store.update(s => { s.entered = true; });
      navigate('research');
      render('#main-content');
      break;
    case 'menu':
      menuOpen = !menuOpen;
      render(menuOpen ? '#site-nav a[aria-current=page], #site-nav a' : null);
      break;
    case 'currency':
      store.update(s => { s.currency = value; });
      render();
      break;
    case 'sample-topic': addKeyword(value); break;
    case 'remove-keyword':
      draft.keywords.splice(Number(value), 1);
      render('[name=keyword]');
      break;
    case 'platform':
      draft.sources = setToggle(draft.sources, value);
      render();
      break;
    case 'news':
      draft.news = !draft.news;
      render();
      break;
    case 'depth':
      draft.depth = value;
      render();
      break;
    case 'plan': {
      if (running) return;
      if (!draft.keywords.length) {
        fieldError('#research-error', 'Add a keyword or choose a sample topic first.');
        return root.querySelector('[name=keyword]').focus();
      }
      const plan = createPlan(data, state, draft);
      if (!Object.keys(plan.rounds).length) return fieldError('#research-error', 'Select an active source or raise the run budget.');
      const sources = data.sources.filter(item => Object.hasOwn(plan.rounds, item.id));
      const format = number => money(number, state.currency, data.exchange);
      showDialog('Confirm sample plan', `<p>${esc(plan.topics.join(' · '))}</p>
        <dl class="summary-list"><div><dt>Sources in this plan</dt><dd>${sources.map(item => item.name).join(', ')}</dd></div>
        <div><dt>Estimated usage</dt><dd>${format(amount(plan))}</dd></div><div><dt>Run budget</dt><dd>${format(plan.fuel)}</dd></div></dl>
        <p class="muted">Custom keyword text stays in this tab. A saved run keeps its fictional topic label and sample results.</p>`, 'Start simulation', 'run');
      break;
    }
    case 'save-run':
      if (currentRun && !state.saved.some(item => item.id === currentRun.id)) {
        store.update(s => s.saved.unshift(currentRun));
        render('#run-outcome');
        say('Research saved in this browser.');
      }
      break;
    case 'open-run':
      currentRun = state.saved.find(item => item.id === value);
      filter = 'all';
      render('#run-outcome');
      break;
    case 'filter':
      filter = value;
      render();
      break;
    case 'clear-saved':
      showDialog('Reset saved research?', '<p>Remove saved copies from this browser. The simulated costs and run history will remain.</p>', 'Reset saved research', 'clear-saved');
      break;
    case 'issue':
      selectedIssue = value;
      render();
      break;
    case 'register': {
      const available = data.issueTemplates.filter(item => !state.addedIssues.includes(item.id));
      if (!available.length) return say('All fictional issue templates are registered.');
      showDialog('Register issue', `<label>Sample issue<select name="issue" required>${available.map(item => views.option(item.id,item.title)).join('')}</select></label>
        <label>Virality threshold<input type="number" name="threshold" min="1" max="100" value="70" required></label>`, 'Register issue', 'register');
      break;
    }
    case 'collect': {
      const issue = [...data.issues, ...data.issueTemplates].find(item => item.id === value);
      if (issue.collectors.every(source => state.paused.includes(source))) return say('Resume one collector source before collecting.');
      store.update(s => { s.collections[value] = (s.collections[value] ?? 0) + 1; });
      render();
      say('Simulated collection recorded.');
      break;
    }
    case 'alert': {
      const issue = [...data.issues, ...data.issueTemplates].find(item => item.id === value);
      showDialog('Edit alert rule', `<label>Virality threshold<input type="number" name="threshold" min="1" max="100"
        value="${state.alerts[value] ?? issue.threshold}" required></label>`, 'Save rule', 'alert', value);
      break;
    }
    case 'pause':
      store.update(s => { s.paused = setToggle(s.paused, value); });
      render();
      say((state.paused.includes(value) ? 'Paused ' : 'Resumed ') + data.sources.find(item => item.id === value).name + '.');
      break;
    case 'cap': {
      const source = data.sources.find(item => item.id === value);
      const isWorkspace = value === 'workspace';
      showDialog(isWorkspace ? 'Edit workspace cap' : 'Edit ' + source.name + ' monthly cap',
        `<label>Monthly cap (IDR)<input type="number" name="cap" min="${isWorkspace ? 1 : 0}" max="100000000" value="${isWorkspace
          ? state.workspaceCap ?? data.monthlyCap : state.caps[value] ?? source.cap}" required></label>`, 'Save cap', 'cap', value);
      break;
    }
    case 'report-part':
      reportPart = Number(value);
      render();
      break;
    case 'add-user': editUser(''); break;
    case 'edit-user': editUser(value); break;
    case 'add-org': {
      const next = data.organisations.slice(2).find(item => !state.organisations.includes(item.id));
      if (next) store.update(s => s.organisations.push(next.id));
      render();
      say('Fictional organisation profile added.');
      break;
    }
    case 'sync':
      store.update(s => { s.lastSync = true; });
      render();
      say('Simulated news sync recorded.');
      break;
    case 'reset':
      showDialog('Reset all demo data?', '<p>Erase saved research, user changes, collections, and settings from this browser. You will return to the landing page.</p>', 'Reset Demo Data', 'reset');
      break;
    case 'exit':
      clearSession();
      store.update(s => { s.entered = false; });
      navigate('welcome');
      render('#main-content');
      break;
  }
});

root.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  const fields = new FormData(form);
  if (form.id === 'keyword-form') addKeyword(fields.get('keyword'), true);
  if (form.id === 'fuel-form') {
    draft.fuel = Number(fields.get('fuel'));
    draft.fuelText = String(draft.fuel);
    render('[name=fuel]');
    say('Run budget set.');
  }
  if (form.id === 'sync-form') {
    store.update(s => { s.interval = Number(fields.get('interval')); });
    render('[name=interval]');
    say('Sample interval saved.');
  }
});

root.addEventListener('input', event => {
  if (event.target.name === 'keyword') draft.keywordText = event.target.value;
  if (event.target.name === 'fuel') draft.fuelText = event.target.value;
});

root.addEventListener('change', event => {
  const { change } = event.target.dataset;
  const { value } = event.target;
  if (!change) return;
  store.update(s => {
    if (change === 'report-check') s.report.checks = setToggle(s.report.checks, Number(value));
    else s.report[change] = value;
  });
  if (change !== 'report-check') render();
});

dialog.addEventListener('click', event => {
  if (event.target.closest('[data-action=cancel]')) dialog.close();
});
dialog.addEventListener('close', () => {
  if (!running && dialogOrigin && (!document.activeElement || !root.contains(document.activeElement))) {
    root.querySelector(dialogOrigin)?.focus();
  }
});
dialog.addEventListener('submit', event => {
  event.preventDefault();
  const { kind, id } = event.target.dataset;
  const fields = new FormData(event.target);
  if (kind === 'run') return startRun();
  if (kind === 'reset') {
    clearSession();
    store.reset();
    dialog.close();
    navigate('welcome');
    render('#main-content');
    return say('Demo data reset.');
  }
  if (kind === 'user') {
    const key = id || fields.get('person');
    const person = data.people.find(item => item.id === key);
    const role = fields.get('role');
    const active = fields.get('status') !== 'disabled';
    const otherAdmins = views.directory(data, store.value).some(item => item.id !== key && item.active && item.role === 'Admin');
    if (!otherAdmins && (!active || role !== 'Admin')) return fieldError('#dialog-error', 'Keep at least one fictional administrator active.');
    store.update(s => {
      s.people[key] = { role, active };
      s.audit.unshift({ action: id ? (active ? 'Updated user' : 'Disabled user') : 'Added user', person: person.name, when: data.demoDay });
    });
  } else store.update(s => {
    if (kind === 'alert') s.alerts[id] = Number(fields.get('threshold'));
    if (kind === 'register') {
      selectedIssue = fields.get('issue');
      s.addedIssues.push(selectedIssue);
      s.alerts[selectedIssue] = Number(fields.get('threshold'));
    }
    if (kind === 'cap') {
      const cap = Number(fields.get('cap'));
      if (id === 'workspace') s.workspaceCap = cap;
      else s.caps[id] = cap;
    }
    if (kind === 'clear-saved') s.saved = [];
  });
  dialog.close();
  render(dialogOrigin);
  say({ alert: 'Alert rule saved.', register: 'Sample issue registered.', cap: 'Budget cap updated.',
    'clear-saved': 'Saved research cleared.', user: 'User directory updated.' }[kind]);
});

document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#main-content')?.focus();
});
window.addEventListener('hashchange', () => {
  if (!data) return;
  menuOpen = false;
  if (dialog.open) dialog.close();
  render('#main-content');
});
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuOpen && !dialog.open) {
    menuOpen = false;
    render('.mobile-menu');
  }
});

try {
  data = await loadDemo();
  draft = newDraft();
  render();
} catch {
  root.innerHTML = '<main class="boot" id="main-content" tabindex="-1"><h1>Sample data could not load</h1><p>Open the demo through a static HTTP preview and reload this page.</p></main>';
}
