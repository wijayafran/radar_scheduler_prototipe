import { icons, lineChart } from './charts.js';
import { amount, history, money, spendingSeries, totals } from './mock-api.js';
import { pages } from './router.js';

export const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const brand = '<div class="brand"><img src="./assets/mark.svg" width="40" height="40" alt=""><div><strong>RADAR</strong><small>Stakeholder demo</small></div></div>';
const sample = '<span class="sample-badge"><i></i>RADAR PROTOTYPE — SAMPLE DATA ONLY</span>';
const viewIcon = name => icons(name === 'research' ? 'search' : name);
export const button = (label, action, value = '', classes = '', extra = '') =>
  `<button type="button" class="button ${classes}" data-action="${action}" data-value="${escape(value)}" ${extra}>${label}</button>`;
export const option = (value, label, selected) =>
  `<option value="${escape(value)}" ${value === selected ? 'selected' : ''}>${escape(label)}</option>`;
const badge = (label, type = '') => `<span class="badge ${type}">${escape(label)}</span>`;
const panel = (title, note, body) => `<section class="panel"><div class="panel-heading"><h2>${title}</h2>${note ? `<p>${note}</p>` : ''}</div>${body}</section>`;
const empty = text => `<p class="empty">${text}</p>`;
const table = (head, rows, name) => `<div class="table-scroll" tabindex="0" role="region" aria-label="${name}"><table><thead><tr>${head.map(field => `<th scope="col">${field}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
const cells = values => `<tr>${values.map(value => `<td>${value}</td>`).join('')}</tr>`;
const format = (data, state) => value => money(value, state.currency, data.exchange);
const percent = (spent, cap) => Math.min(100, Math.round(spent * 100 / Math.max(1, cap)));
const progress = (value, max, label) => `<progress value="${Math.min(value, max)}" max="${max}" aria-label="${label}"></progress>`;
const sourceName = (data, id) => escape(data.sources.find(source => source.id === id)?.name ?? '');
const statusTone = status => ({ Elevated: 'danger', Watch: 'warning', Stable: 'success', Positive: 'success', Concern: 'danger', Neutral: '' })[status] ?? '';
const toggle = (label, action, value, pressed, classes = '') => button(label, action, value, classes, `aria-pressed="${pressed}"`);

function signalArtwork() {
  const dots = [[190,131,4],[295,97,3],[340,193,6],[287,272,3],[153,254,4],[226,323,3],[391,291,4],[140,176,2],[365,112,2],[241,125,2]];
  return `<svg viewBox="0 0 510 380" class="signal-art" aria-hidden="true">
    <defs><radialGradient id="signal-fill"><stop stop-color="#55ddc1" stop-opacity=".16"/><stop offset="1" stop-color="#55ddc1" stop-opacity="0"/></radialGradient></defs>
    <circle cx="255" cy="190" r="165" fill="url(#signal-fill)"/>
    <g fill="none" stroke="#36566c"><circle cx="255" cy="190" r="38"/><circle cx="255" cy="190" r="76"/><circle cx="255" cy="190" r="114"/><circle cx="255" cy="190" r="152"/><path d="M85 190h340M255 20v340M148 83l214 214M148 297 362 83" stroke-dasharray="3 7"/></g>
    <path d="M255 190V38a152 152 0 0 1 127 68Z" fill="#53dcc0" opacity=".10"/><path d="m255 190 130-84" stroke="#64e5ca" stroke-width="1.6"/>
    <g fill="#64e5ca">${dots.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}<circle cx="255" cy="190" r="5"/></g>
    <g fill="none" stroke="#64e5ca" opacity=".48"><circle cx="340" cy="193" r="13"/><circle cx="190" cy="131" r="10"/><circle cx="153" cy="254" r="10"/></g>
  </svg>`;
}

export function welcome() {
  return `<div class="welcome"><header class="welcome-top">${brand}${sample}</header>
    <main id="main-content" tabindex="-1" class="welcome-main">
      <div class="welcome-copy"><h1>Follow the signals that matter.</h1>
        <p>Explore how a research team plans a search, monitors an issue, and turns findings into a stakeholder brief.</p>
        ${button(icons('play') + ' Continue to Demo', 'enter', '', 'primary enter')}
        <div class="welcome-note">${icons('shield')} Opens a fictional workspace with the demo account, Avery Vale.</div>
      </div><div class="welcome-visual">${signalArtwork()}<div class="visual-caption"><span class="dot"></span> Signal preview <span>Fictional traces</span></div></div>
    </main><footer class="welcome-foot"><span>Lumen Signal Studio · Fictional workspace</span><span>Browser-only interactive demo</span></footer></div>`;
}

export function shell(data, state, route, content, menuOpen, storageAvailable) {
  const [title, subtitle] = pages[route];
  const cap = state.workspaceCap ?? data.monthlyCap;
  const spent = totals(data, state).month;
  const moneyForState = format(data, state);
  const links = Object.entries(pages).filter(([id]) => id !== 'profile').map(([id, [label]]) =>
    `<a href="#${id}" ${id === route ? 'aria-current="page"' : ''}>${viewIcon(id)}<span>${label}</span></a>`).join('');
  return `<div class="shell">
    <aside class="rail ${menuOpen ? 'menu-open' : ''}" aria-label="Workspace">
      <a class="brand-link" href="#research" aria-label="RADAR live research">${brand}</a>
      <nav id="site-nav" aria-label="Main navigation">${links}</nav>
      <div class="rail-budget"><div class="split"><span>Workspace spend</span><strong>${percent(spent, cap)}%</strong></div>
      <b>${moneyForState(spent)}</b>${progress(spent, cap, 'Monthly workspace usage')}<small>of ${moneyForState(cap)} in ${data.month}</small></div>
      <a class="rail-user" href="#profile" ${route === 'profile' ? 'aria-current="page"' : ''}><span class="avatar">AV</span><span><b>Avery Vale</b><small>Demo administrator</small></span>${icons('next')}</a>
    </aside>
    <div class="surface">
      <header class="topbar">
        ${button(icons('menu'), 'menu', '', 'icon-button mobile-menu', `aria-label="Toggle navigation" aria-controls="site-nav" aria-expanded="${menuOpen}"`)}
        ${sample}
        <div class="top-tools"><div class="segmented" aria-label="Currency">${['IDR','USD'].map(currency => toggle(currency, 'currency', currency, state.currency === currency)).join('')}</div>
        <a class="avatar top-avatar" href="#profile" aria-label="Demo profile">AV</a></div>
      </header>
      <main id="main-content" tabindex="-1" class="content">
        <div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div><span class="workspace-name">${escape(data.workspace)}</span></div>
        ${storageAvailable ? '' : '<p class="info">Browser storage is unavailable. Changes will last for this session.</p>'}
        ${content}
      </main>
    </div></div>`;
}

export function research(data, state, draft, plan, run, running, filter) {
  const m = format(data, state);
  const plannedSocial = Object.keys(plan.rounds).filter(id => id !== 'news').length;
  const newsPaused = state.paused.includes('news');
  const chosenDepth = data.depths.find(item => item.id === draft.depth);
  const chips = draft.keywords.map((keyword, index) => `<span class="keyword-chip">${escape(keyword)}${button(icons('close'), 'remove-keyword', index, 'icon-button', `aria-label="Remove ${escape(keyword)}"`)}</span>`).join('');
  const platforms = data.sources.filter(item => item.id !== 'news').map(item => {
    const paused = state.paused.includes(item.id);
    return toggle(item.name + (paused ? ' · Paused' : ''), 'platform', item.id,
      draft.sources.includes(item.id), 'platform' + (paused ? ' paused' : ''));
  }).join('');
  const planCard = `<section class="panel plan-summary">
    <div class="panel-heading"><h2>Research plan</h2><p>Review the sample before starting.</p></div>
    <dl class="summary-list"><div><dt>Keywords</dt><dd>${draft.keywords.length}</dd></div>
      <div><dt>Planned social sources</dt><dd>${plannedSocial} of ${draft.sources.length} selected</dd></div>
      <div><dt>News index</dt><dd>${!draft.news ? 'Off' : newsPaused ? 'Paused' : 'Included'}</dd></div>
      <div><dt>Depth</dt><dd>${chosenDepth.name}</dd></div><div><dt>Run budget</dt><dd>${m(draft.fuel)}</dd></div></dl>
    <div class="estimate"><span>Estimated usage</span><strong data-estimate>${m(amount(plan))}</strong><small>Illustrative cost. No charges are made.</small></div>
    ${button('Review plan', 'plan', '', 'primary wide', running ? 'disabled' : '')}
    <p class="form-error" id="research-error" role="alert" hidden></p>
  </section>`;
  const saved = panel('Saved research', '', state.saved.length
    ? `<div class="list">${state.saved.map(item => `<div class="list-row"><div><b>${escape(item.topics.join(' · '))}</b><small>${escape(item.id)}</small></div>
      ${button('Open', 'open-run', item.id, 'compact', 'aria-label="Open saved run ' + escape(item.id) + '"')}</div>`).join('')}</div>
      ${button('Reset saved research', 'clear-saved', '', 'quiet saved-reset')}`
    : empty('Save a completed run to reopen it here.'));
  let outcome = '';
  if (running) outcome = `<section class="panel run-progress" id="run-outcome" tabindex="-1">
    <div class="split"><div><h2>Simulating research</h2><p id="run-stage">Preparing sample sources</p></div><strong id="run-percent">0%</strong></div>
    <progress id="run-progress" value="0" max="100" aria-label="Research progress"></progress></section>`;
  else if (run) {
    const list = filter === 'all' ? run.results : run.results.filter(result => result.source === filter);
    outcome = `<section class="panel results" id="run-outcome" tabindex="-1">
      <div class="panel-heading split"><div><div class="cluster">${badge('Completed', 'success')}<span class="muted">${escape(run.id)}</span></div><h2>${escape(run.topics.join(' · '))}</h2><p>${run.results.length} sample results · ${m(amount(run))} simulated usage</p></div>
      ${button(state.saved.some(item => item.id === run.id) ? 'Saved' : 'Save research', 'save-run', '', 'primary', state.saved.some(item => item.id === run.id) ? 'disabled' : '')}</div>
      <div class="filters" aria-label="Filter results">${toggle('All results', 'filter', 'all', filter === 'all')}${Object.keys(run.rounds).map(id => toggle(sourceName(data, id), 'filter', id, filter === id)).join('')}</div>
      ${list.length ? `<div class="result-list">${list.map(result => `<article class="result"><div class="cluster"><span>${sourceName(data, result.source)}</span>${badge(result.tone, statusTone(result.tone))}</div>
        <h3>${escape(result.title)}</h3><p>${escape(result.detail)}</p><small>${escape(result.author)} · ${escape(result.theme)}${result.source === 'news' ? '' : ' · ' + result.reach.toLocaleString() + ' sample reach'}</small></article>`).join('')}</div>` : empty('No sample results for this source.')}</section>`;
  }
  return `<div class="work-grid"><div class="stack">
    ${panel('What are you researching?', 'Enter a fictional keyword or choose a sample topic.',
      `<form id="keyword-form" class="keyword-form" aria-label="Add a keyword"><div class="keyword-field">${icons('search')}${chips}
        <input name="keyword" aria-label="Keyword" maxlength="60" placeholder="Add a keyword or hashtag" value="${escape(draft.keywordText)}" required></div>
      <button class="button" type="submit">${icons('plus')} Add</button></form>
      <div class="suggestions"><span>Try a topic</span>${data.topics.slice(0,3).map(topic => button(topic, 'sample-topic', topic, 'compact quiet')).join('')}</div>`)}
    ${panel('Where should RADAR look?', '', `<div class="source-grid">
      <div class="source-lane"><h3>Social media</h3><p>Replay public conversation from bundled sample posts.</p><div class="filters">${platforms}</div></div>
      <div class="source-lane"><div class="split"><h3>News &amp; articles</h3>${button('<span></span>', 'news', '', 'switch', `role="switch" aria-label="Include news index" aria-checked="${draft.news}"`)}</div>
      <p>Include headlines from the fictional news index.</p><span class="detail-chip">${newsPaused ? 'Paused in source controls' : draft.news ? 'Included · no simulated cost' : 'Excluded from this plan'}</span></div></div>`)}
    ${panel('How deep should the search go?', '', `<div class="depth-grid" aria-label="Research depth">${data.depths.map(item =>
      toggle(`<strong>${item.name}</strong><span>${item.detail}</span>`, 'depth', item.id, draft.depth === item.id, 'depth')).join('')}</div>
      <form id="fuel-form" class="inline-form"><label>Run budget (IDR)<input type="number" name="fuel" min="0" max="10000000" step="1" value="${escape(draft.fuelText)}" required></label>
      <button class="button" type="submit">Set budget</button><span class="muted">Estimated usage follows the available caps.</span></form>`)}
    </div><aside class="stack research-aside">${planCard}${saved}</aside></div>${outcome}`;
}

export function monitor(data, state, issueId) {
  const issues = [...data.issues, ...data.issueTemplates.filter(item => state.addedIssues.includes(item.id))];
  const issue = issues.find(item => item.id === issueId) ?? issues[0];
  const last = issue.trend.at(-1);
  const threshold = state.alerts[issue.id] ?? issue.threshold;
  const collected = state.collections[issue.id] ?? 0;
  return `<div class="monitor-grid">
    <section class="panel"><div class="panel-heading"><h2>Tracked issues</h2><p>${issues.length} issues in June</p></div>
    ${issues.map(item => toggle(`<span><strong>${item.title}</strong><small>${item.tag}</small></span>${badge(item.status, statusTone(item.status))}`, 'issue', item.id, issue.id === item.id, 'issue-item')).join('')}
    ${button(icons('plus') + ' Register issue', 'register', '', 'wide register-button')}</section>
    <div class="stack"><section class="panel">
      <div class="panel-heading split"><div><h2>${issue.title}</h2><p>${issue.tag} · Last 12 sample days</p></div>${badge(issue.status, statusTone(issue.status))}</div>
      <div class="chart-holder"><div class="split chart-heading"><h3>Virality trend</h3><span><b>${last}</b> / 100</span></div>
        ${lineChart(issue.trend, 'Virality trend, latest score ' + last + ' out of 100', 100, value => value)}</div>
      <div class="sentiment" aria-label="Sentiment breakdown">${['Positive','Neutral','Concern'].map((label, index) =>
        `<div class="sentiment-${index}"><div class="split"><span>${label}</span><b>${issue.sentiment[index]}%</b></div>${progress(issue.sentiment[index],100,label + ' share')}</div>`).join('')}</div>
    </section>
    ${panel('Collectors', 'Run a local collection for the selected issue.', `<div class="list">${issue.collectors.map(id =>
      `<div class="list-row"><b>${sourceName(data,id)}</b>${badge(state.paused.includes(id) ? 'Paused' : 'Sample ready', state.paused.includes(id) ? 'warning' : 'success')}</div>`).join('')}</div>
      <div class="toolbar">${button('Collect now', 'collect', issue.id, 'primary')}${collected ? `<span class="muted">${collected} simulated collection${collected === 1 ? '' : 's'}</span>` : ''}</div>`)}
    ${panel('Alert rule', '', `<div class="split alert-row"><div><b>Virality threshold · ${threshold}/100</b><p>${last >= threshold ? 'The latest sample score meets this rule.' : 'The latest sample score is below the threshold.'}</p></div>${button('Edit rule', 'alert', issue.id)}</div>`)}
    </div></div>`;
}

function controls(data, state, editCaps) {
  const m = format(data, state);
  const spent = totals(data, state);
  return table(['Source', 'Mode', 'Used / cap', 'Controls'], data.sources.map(item => cells([
    `<b>${item.name}</b>`, badge(state.paused.includes(item.id) ? 'Paused' : 'Active', state.paused.includes(item.id) ? 'warning' : 'success'),
    item.id === 'news' ? 'No simulated cost' : `<span class="tabular">${m(spent.sources[item.id])} / ${m(state.caps[item.id] ?? item.cap)}</span>`,
    `<div class="cluster">${button(state.paused.includes(item.id) ? 'Resume' : 'Pause', 'pause', item.id, 'compact', `aria-label="${state.paused.includes(item.id) ? 'Resume' : 'Pause'} ${item.name}"`)}
    ${editCaps && item.id !== 'news' ? button('Edit cap', 'cap', item.id, 'compact quiet', `aria-label="Edit ${item.name} cap"`) : ''}</div>`,
  ])), 'Source budgets and controls');
}

export function costs(data, state) {
  const m = format(data, state);
  const spent = totals(data, state).month;
  const cap = state.workspaceCap ?? data.monthlyCap;
  const series = spendingSeries(data, state);
  const max = Math.max(40000, Math.ceil(Math.max(...series) / 40000) * 40000);
  const rows = history(data, state).reverse();
  return `<div class="stack"><section class="panel">
    <div class="panel-heading split"><div><h2>Daily spending</h2><p>${data.month} · Illustrative ledger</p></div>${badge(state.currency + ' · display currency')}</div>
    <div class="metric-strip"><div><span>Month to date</span><b>${m(spent)}</b></div><div><span>Remaining budget</span><b>${m(Math.max(0, cap - spent))}</b></div><div><span>Workspace cap</span><b>${m(cap)}</b></div></div>
    <div class="chart-holder">${lineChart(series, 'Daily simulated spending in ' + state.currency, max,
      value => state.currency === 'USD' ? '$' + (value / data.exchange).toFixed(1) : 'Rp ' + Math.round(value / 1000) + 'k')}</div>
    <p class="chart-note">Fixed demo rate · US$1 = Rp ${data.exchange.toLocaleString()}</p></section>
    ${panel('Platform budgets', 'Pause a source or adjust its monthly cap. Changes apply to new plans.', controls(data, state, true))}
    ${panel('Run history', 'Completed sample runs for this month.', table(['Run', 'Topic', 'Date', 'Simulated usage'],
      rows.map(run => cells([escape(run.id), escape(run.topic), escape(run.day), m(amount(run))])), 'Sample run history'))}
    </div>`;
}

export function reports(data, state, part) {
  const prefs = state.report;
  const language = prefs.language === 'id' ? 'id' : 'en';
  const sections = data.report.sections;
  const item = sections[part];
  const copy = item[language];
  return `<div class="report-grid"><div class="stack">
    <section class="panel"><div class="panel-heading"><h2>Harborlight issue brief</h2><p>Prepared example · ${data.month}</p></div>
      ${sections.map((section, index) => toggle(section[language].title, 'report-part', index, part === index, 'report-tab')).join('')}</section>
    ${panel('Quality checklist', 'Mark what you have reviewed.', data.report.checks.map((label, index) =>
      `<label class="check-row"><input type="checkbox" data-change="report-check" value="${index}" ${prefs.checks.includes(index) ? 'checked' : ''}> ${label}</label>`).join(''))}
    </div><section class="panel report-paper">
      <div class="report-controls"><label>Audience<select data-change="audience">${['Leadership','Operations','Communications'].map(value => option(value, value, prefs.audience)).join('')}</select></label>
      <label>Language<select data-change="language">${option('en','English',language)}${option('id','Bahasa Indonesia',language)}</select></label></div>
      <div class="brief-copy" lang="${language}"><div class="split"><p class="muted">${copy.title}</p>${badge('Fictional evidence')}</div>
      <h2>${copy.heading}</h2><p>${copy.body}</p><h3>${language === 'id' ? 'Tindakan yang disarankan' : 'Suggested action'}</h3><p>${copy.recommendation}</p></div>
      <h3>Evidence in this section</h3><div class="list">${data.report.evidence.filter(entry => item.evidence.includes(entry.id)).map(entry =>
        `<div class="list-row"><span><b>${entry.title}</b><small>${entry.source} · ${entry.type}</small></span>${badge(entry.id)}</div>`).join('')}</div>
      <div class="report-footer">${button('Previous', 'report-part', part - 1, '', part === 0 ? 'disabled' : '')}<span>Page ${part + 1} of ${sections.length}</span>
      ${button('Next', 'report-part', part + 1, '', part === sections.length - 1 ? 'disabled' : '')}</div>
    </section></div>`;
}

export function directory(data, state) {
  return data.people.flatMap(person => {
    const patch = state.people[person.id];
    return person.active || patch ? [{ ...person, ...(patch || {}) }] : [];
  });
}

export function users(data, state) {
  const people = directory(data, state);
  return `<div class="stack"><section class="panel"><div class="panel-heading split"><div><h2>User directory</h2><p>${people.length} fictional accounts</p></div>
    ${button(icons('plus') + ' Add user', 'add-user', '', 'primary')}</div>
    ${table(['Name','Role','Status','Action'],people.map(person => cells([
      `<b>${escape(person.name)}</b><small class="cell-note">${escape(person.email)}</small>`, escape(person.role),
      badge(person.active ? 'Active' : 'Disabled',person.active ? 'success' : 'warning'),
      button('Edit', 'edit-user', person.id, 'compact', `aria-label="Edit ${escape(person.name)}"`),
    ])), 'Fictional user directory')}</section>
    ${panel('Audit history', 'Changes made in this browser.', state.audit.length
      ? `<div class="list">${state.audit.map(item => `<div class="list-row"><div><b>${escape(item.action)}</b><small>${escape(item.person)}</small></div><span class="muted">${escape(item.when)}</span></div>`).join('')}</div>`
      : empty('User changes will appear here.'))}</div>`;
}

export function settings(data, state) {
  const m = format(data, state);
  const organisations = data.organisations.filter((item,index) => index < 2 || state.organisations.includes(item.id));
  return `<div class="stack">
    ${panel('Organisation profiles', 'Fictional entities available for sample operations.', `<div class="list">${organisations.map(item =>
      `<div class="list-row"><div><b>${item.name}</b><small>${item.aliases}</small></div>${badge('Sample profile')}</div>`).join('')}</div>
      <div class="toolbar">${button('Add sample profile','add-org','', '', organisations.length === data.organisations.length ? 'disabled' : '')}</div>`)}
    ${panel('News sync', 'Set a sample refresh interval or record a simulated sync.', `<form class="inline-form" id="sync-form">
      <label>Refresh interval<select name="interval">${[60,180,360].map(value => option(value,value + ' minutes',state.interval)).join('')}</select></label>
      <button class="button" type="submit">Save interval</button>${button('Simulate sync now','sync','', 'primary')}
      ${state.lastSync ? '<span class="muted">Sample sync recorded</span>' : ''}</form>`)}
    ${panel('Source controls', 'Paused sources are excluded from new plans.', controls(data,state,true))}
    ${panel('Workspace budget','Caps feed the plan and the Runs &amp; costs view.', `<div class="split"><strong>${m(state.workspaceCap ?? data.monthlyCap)} monthly cap</strong>${button('Edit workspace cap','cap','workspace')}</div>`)}
    ${panel('Demo data','Restore the original fixtures and erase local changes from this browser.', button('Reset Demo Data','reset','', 'danger-button'))}
    </div>`;
}

export function profile(data, state) {
  const person = data.people[0];
  return `<div class="profile-grid">
    ${panel('Demo account','', `<div class="profile-person"><span class="avatar large-avatar">AV</span><div><h3>${person.name}</h3><p>${escape(data.workspace)}</p></div></div>
      <dl class="summary-list"><div><dt>Email</dt><dd>${person.email}</dd></div><div><dt>Role</dt><dd>${escape(state.people[person.id]?.role ?? person.role)}</dd></div>
      <div><dt>Access</dt><dd>Demo session</dd></div></dl><div class="toolbar">${button('Sign out','exit')}</div>`)}
    ${panel('Account history','Illustrative activity.', `<div class="list"><div class="list-row"><b>Entered the prototype</b>${badge('This session','success')}</div>
      <div class="list-row"><b>Joined the fictional workspace</b><span>05 Jun 2026</span></div><div class="list-row"><b>Assigned demo administrator role</b><span>05 Jun 2026</span></div></div>`)}
    </div>`;
}
