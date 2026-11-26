import {accessChanges, cap, date, daySpend, history, issues, monthSpend, people, posts, rate, reportSections, researchSpend, collectorSpend, sources} from '../data/sample.js';

export const routes = {
  research:['Live research','Search sample posts now, inside a budget you set','⌕'],
  monitor:['Monitor','Issues the sample workspace collects on a schedule','⌁'],
  costs:['Runs & costs','Every sample rupiah, by run, source and collector','▥'],
  reports:['Reports','Review a prepared brief built from sample research','▤'],
  users:['Users','Who can open the sample workspace and what they can change','♧'],
  settings:['Settings','Sample news settings and organisation profiles','⚙'],
  profile:['Profile','Your sample account','◉'],
};
const initials = 'DA';
const mark = '<img class="mark" src="./assets/mark.svg" alt="" width="26" height="26">';
const small = n => new Intl.NumberFormat('en').format(n);
export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const money = (amount, currency) => currency === 'USD' ? `US$ ${(amount / rate).toFixed(2)}` : `Rp ${small(amount)}`;
const concise = (amount, currency) => currency === 'USD' ? money(amount,currency) : amount >= 1000000 ? `Rp ${(amount/1000000).toFixed(2)}M` : amount >= 1000 ? `Rp ${(amount/1000).toFixed(1)}k` : money(amount,currency);
const btn = (label, action, value = '', css = '', attributes = '') => `<button type="button" class="btn ${css}" data-action="${action}" data-value="${escape(value)}" ${attributes}>${label}</button>`;
const inactive = label => `<button type="button" class="btn" disabled>${label}</button>`;
const press = state => `aria-pressed="${state}"`;
const pill = (label, tone = 'neutral') => `<span class="pill ${tone}">${label}</span>`;
const header = (title, sub = '', extra = '') => `<header class="card-h"><h2>${title}</h2>${sub ? `<span class="sub">${sub}</span>` : ''}${extra ? `<div class="right">${extra}</div>` : ''}</header>`;
const table = (heads, rows, label = '') => `<div class="table-scroll" tabindex="0" role="region" aria-label="${escape(label || heads[0] + ' table')}"><table><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(td=>`<td>${td}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const select = (id, options, current) => `<select id="${id}">${options.map(([key,label])=>`<option value="${key}" ${key===current?'selected':''}>${label}</option>`).join('')}</select>`;

export function welcome(theme) {
  return `<section id="login" class="login" aria-label="Sign in"><aside class="login-visual" aria-label="What RADAR does">
    <div class="login-scene"></div><div class="login-scope" aria-hidden="true"></div>
    <div class="login-brand"><span>${mark} <b>Demo Research<br>Workspace</b></span><span><span class="symbol">◎</span> <b>Sample Mode<br><small>Fictional data</small></b></span></div>
    <div class="login-story"><p>Every<br>observation.<br><em>One radar.</em></p>${btn('▷ &nbsp; Sign in to see the tour','enter','','tour')}
    <div class="listening"><span>LISTENING ON</span>${sources.map(([,label,,icon])=>`<span title="${label}">${icon}</span>`).join('')}</div></div>
  </aside><main class="login-main"><div class="login-form"><h1>Sign in to ${mark} <strong>RADAR</strong></h1>
    <p>Use the demo workspace to explore Sample Mode. All accounts, research and metrics are fictional.</p>
    ${btn('◇ &nbsp; Continue with Sample Mode','enter','','primary','id="lgSso"')}
    <p class="muted small">Continue directly to the local demo. The demo does not ask for a password or connect to a sign-in service.</p>
    <ul class="login-list"><li><span>♙</span> Browser-only demo sign-in</li><li><span>□</span> No work account is required</li><li><span>♧</span> Sample roles demonstrate how access is presented</li></ul>
    <p class="small">Exploring the prototype? <a href="#research" data-action="enter">Open the sample workspace</a></p></div>
    <footer><span>RADAR Sample Mode</span>${btn(theme==='dark'?'Light mode':'Dark mode','theme','','plain')}</footer></main></section>`;
}

export function shell(state, route, body) {
  const [title,crumb] = routes[route];
  const links = Object.entries(routes).map(([key, [label,, icon]])=>`<a href="#${key}" data-v="${key}" ${key===route?'aria-current="page"':''}><span class="navico" aria-hidden="true">${icon}</span>${label}${key==='research'?pill('Live','good'):key==='monitor'?pill('1','warn'):''}</a>`).join('');
  const spendPercent = Math.round(monthSpend / cap * 100);
  return `<div class="app"><aside class="rail" aria-label="Sidebar"><div class="rail-brand"><span class="symbol">◎</span><span class="brand-divider"></span>${mark}<b>RADAR</b></div>
  <nav class="nav" aria-label="Workspace">${links}</nav><h2 class="rail-sec">March spend</h2><div class="rail-spend"><div><span>Workspace cap</span><b>${concise(monthSpend,state.currency)}</b></div><progress max="100" value="${spendPercent}" aria-label="Workspace cap used"></progress><div><span>of ${concise(cap,state.currency)}</span><span>${spendPercent}%</span></div></div>
  <a href="#profile" class="rail-person"><span class="avatar">${initials}</span><span>${people[0].name}<small>Demo Research Workspace</small></span></a></aside>
  <main class="main"><header class="top"><div class="top-in"><div><h1>${title}</h1><p>${crumb}</p></div><div class="top-actions">${pill('● &nbsp; Sample data','warn')}<span class="fx">US$1 = Rp ${small(rate)} · sample rate</span><div class="segments">${['IDR','USD'].map(c=>btn(c,'currency',c,'plain',`id="cur${c}" ${press(state.currency===c)}`)).join('')}</div><a class="avatar" href="#profile" aria-label="Profile">${initials}</a></div></div>
  <nav class="mnav" aria-label="Workspace">${links}</nav></header><section id="v-${route}" class="workspace ${['users','settings','profile'].includes(route)?'compact':''}">${body}</section></main></div>`;
}

const step = (number,title,description) => `<div class="step"><span>${number}</span><div><h2>${title}</h2><p>${description}</p></div></div>`;
const depths = [
  ['Scan','First page of results for each keyword. News from the last 7 days.'],
  ['Investigate','Multiple pages per keyword and a wider sample of news coverage.'],
  ['Deep dive','The longest sample window and the most detailed review plan.'],
];

export function research(state) {
  const {currency, depth, saved, active, source, sort, page, pending, tags, enabledSources} = state;
  const run = active && saved.find(item => item.id === active);
  const cost = n => money(n,currency);
  const savedCard = `<section class="card" id="savedCard">${header('Saved research',`${saved.length} ${saved.length===1?'run':'runs'} · reopen to read again`)}<div class="card-b stack">${saved.map(item=>`<article class="saved-row"><div><b>${escape(item.topic)}</b><small class="mono">${item.id} · ${item.time}</small></div><span>${item.depth} · ${item.sources ? posts.filter(post=>item.sources.includes(post.source)).length : posts.length} results · ${cost(item.spent)} sample spend</span>${btn('Open','open',item.id,'','data-open')}</article>`).join('') || '<p class="muted">No saved runs.</p>'}</div></section>`;
  const composer = `<section class="card composer" id="composer">
    ${step(1,'What do you want to understand?','Add the words people and the press would use. The sample plan groups keywords, hashtags and local variants.')}
    <div class="query"><span aria-hidden="true">⌕</span>${tags.map((tag,i)=>btn(`${escape(tag)} &nbsp; ×`,'remove-tag',i,'chip',`aria-label="Remove keyword ${escape(tag)}"`)).join('')}<input id="keyword" aria-label="Add a keyword" maxlength="45" placeholder="Add a keyword, hashtag or account, then press Enter"></div>
    ${step(2,'Where should RADAR look?','Pick one lane or both. Social media describes how people feel. News describes what was reported.')}
    <div class="lanes"><article class="lane on"><h3>Social media ${pill('Perception and sentiment')}</h3><p>Fictional public posts from nine types of social feeds. A limited replay illustrates the results for each source.</p><p class="mono">${cost(300)} per sample search · ${cost(500)} per sample reading batch</p><div class="lane-meta"><b>Platforms ${enabledSources.filter(x=>x!=='news').length} of 9</b>${btn('All social media','all-sources','','chip')}</div><div class="chips">${sources.slice(0,-1).map(([id,label,,glyph])=>btn(`${glyph} &nbsp; ${label}`,'source',id,'chip',press(enabledSources.includes(id)))).join('')}</div></article>
    <article class="lane on"><h3>News and articles ${pill('Reported coverage')} <span class="right">${btn('✓','source','news','chip',press(enabledSources.includes('news')))}</span></h3><p>Generated headlines, outlets, themes and tone from the sample news lane. The public demo uses local examples.</p><p class="mono">Sample news index · ${cost(0)}</p><label for="news-range">How far back &nbsp; <output>30 days · 8 stories</output></label><input id="news-range" type="range" value="30" min="7" max="210" disabled><div class="ticks"><span>7 days</span><span>30 days</span><span>3 months</span><span>7 months</span></div><div class="lane-meta"><span>Outlets to include</span>${pill('Trusted')}${pill('Medium')}${pill('Low')}</div><div class="lane-meta"><span>Filters</span><span>All stories</span>${inactive('Edit filters')}</div></article></div>
    ${step(3,'How far, and how much fuel?','Depth sets how hard RADAR digs. Fuel is the most the sample plan may spend. No actual costs are incurred.')}
    <div class="depths">${depths.map(([label,description],i)=>btn(`<b>${label}</b><span>${description}</span><small class="mono">Full plan needs about ${cost([18000,96000,192000][i])}</small>`,'depth',label,'depth',press(depth===label))).join('')}</div>
    <div class="fuel"><label for="fuel">Fuel for this run <input id="fuel" inputmode="numeric" value="${state.fuel}" aria-label="Fuel amount in rupiah"></label><div class="chips">${[18000,96000,192000].map(m=>btn(cost(m),'fuel',m,'chip')).join('')}</div></div>
    <div class="run-actions"><div><p class="muted">Planning is free. The result replay is made from fictional records.</p><p id="research-error" role="status">${escape(state.error)}</p></div>${btn('Plan the run','plan','','primary','id="startBtn"')}</div>
  </section>`;
  const plan = pending ? `<section class="card" id="planCard">${header('Review the plan','Fictional stored replay · 220 results in the full sample')}
    <div class="card-b stack"><b>${escape(pending.topic)}</b><p class="muted">${pending.depth} · ${pending.sources.length} selected sources · fuel ${cost(pending.cap)}</p>${table(['Lane','Sources','Replay records'],[['Social media',pending.sources.filter(x=>x!=='news').length,posts.filter(p=>pending.sources.includes(p.source)&&p.source!=='news').length],['News',pending.sources.includes('news')?1:0,pending.sources.includes('news')?8:0]])}
    <div class="run-actions"><p class="muted">Lock in to view the recorded sample results.</p>${btn('Lock in and run','run','','primary','id="lockBtn"')}</div></div></section>` : '';
  if (!run) return composer + plan + savedCard;
  const replay = posts.filter(post => (run.sources || sources.map(([id])=>id)).includes(post.source));
  const filtered = replay.filter(p=>source==='all'||p.source===source).sort((a,b)=>sort==='vir'?b.score-a.score||a.order-b.order:a.order-b.order);
  const pages = Math.max(1,Math.ceil(filtered.length/20));
  const items = filtered.slice((page-1)*20,page*20);
  const feed = `<section class="card" id="runCard">${header('Sample research result',escape(run.topic),btn('Run ledger','ledger',run.id,'','id="ledgerBtn"')+btn('New plan','new'))}<div class="card-b stack">
    <div class="result-kpis">${kpi('Results',replay.length,'Fictional replay')}${kpi('Social posts',replay.filter(p=>p.source!=='news').length,'Sample social coverage')}${kpi('News stories',replay.filter(p=>p.source==='news').length,'Sample reported coverage')}${kpi('Sample cost',cost(run.spent),`of ${cost(run.cap)} fuel`)}</div>
    <div class="feed-actions"><div id="feedTabs" class="chips">${[['all','All'],...sources].map(([id,label])=>btn(label,'filter',id,'chip',press(source===id))).join('')}</div><div class="segments">${btn('Newest','sort','new','plain',press(sort==='new'))}${btn('Virality','sort','vir','plain',press(sort==='vir'))}</div></div>
    <p class="muted" id="feedStat">${filtered.length} results · showing ${items.length?(page-1)*20+1:0}–${(page-1)*20+items.length}</p><div id="feed" class="feed stack">${items.map(p=>`<article data-id="${p.id}" class="post"><p class="muted small">${p.label} · ${p.edition} · ${p.day}</p><h3>${p.title}</h3><p>${p.text}</p><div>${pill(p.tone,p.tone==='Negative'?'warn':p.tone==='Positive'?'good':'neutral')} <span class="mono">V ${p.score} · ${p.id}</span></div></article>`).join('') || '<p>No cards match this filter.</p>'}</div>
    <div class="pager">${btn('‹ Previous','page',page-1,'',page===1?'disabled':'')}<span class="mono" id="feedRange">${page} / ${pages}</span>${btn('Next ›','page',page+1,'',page===pages?'disabled':'')}</div></div></section>`;
  return feed + savedCard;
}

function kpi(label,value,detail) {
  return `<article class="card kpi"><span>${label}</span><strong>${value}</strong><p>${detail}</p></article>`;
}

function series(values, tone = 'line', grid = false) {
  const coordinates = values.map((v,i)=>[12+i*376/(values.length-1),110-v]).map(([x,y])=>`${x.toFixed(1)},${y}`).join(' ');
  return `<svg class="series ${tone}" viewBox="0 0 400 116" role="img" aria-label="${grid?'Synthetic trend chart':'Synthetic trend sparkline'}" preserveAspectRatio="none">${grid?'<path class="grid" d="M12 20H388 M12 45H388 M12 70H388 M12 95H388"/>':''}<polygon points="12,110 ${coordinates} 388,110"/><polyline points="${coordinates}"/></svg>`;
}
const trend = (seed, points = 20) => Array.from({length:points},(_,i)=>Math.min(98,12+(i*seed*7)%23+Math.round(58*Math.exp(-Math.pow((i-points*.69)/(points*.16),2)))));
const tone = status => status==='Escalate'?'hot':status==='Watch'?'warn':'good';

export function monitor(state) {
  const issue = issues.find(i=>i.id===state.issue) || issues[0];
  const cost = n=>money(n,state.currency);
  const metrics = [['Virality index',`${issue.score}/100`,'Sample attention'],['Net sentiment',issue.sentiment,'Projected sample index'],['Reposts',small(issue.reposts),'Across sample sources'],['Est. reach',issue.reach,'Fictional estimate'],['Velocity',`${issue.velocity}/h`,'Current sample period'],['Mentions',small(issue.mentions),'Stored example window']];
  const detail = `<div id="issueDetail" class="stack"><section class="card issue-head">${header(escape(issue.name),pill(issue.status,tone(issue.status)),inactive('Collect now')+inactive('Add collector')+inactive('Generate brief'))}
  <div class="card-b"><div class="chips">${issue.tracks.map(t=>pill(t)).join('')}</div><div class="batch"><b>Sample batch is collecting.</b><p>Four of five sources returned. The display keeps the last complete sample snapshot.</p><div class="batch-line"><span></span><span></span><span></span><span></span><span></span></div><small>Short video · done &nbsp; Microblog · done &nbsp; Community · done &nbsp; News · done</small></div></div></section>
  <div class="monitor-kpis">${metrics.map(([label,v,d],i)=>`<article class="card kpi"><span>${label}</span><strong>${v}</strong><p>${d}</p>${series(trend(issue.score+i,12),i===1?'alert-line':'line')}</article>`).join('')}</div>
  <div class="split monitor-charts"><section class="card">${header('Mentions per hour','12–18 Mar · sample time')}
  <div class="card-b"><div class="chart-box monitor-chart">${series(trend(issue.score,34),'line',true)}<div class="chart-days"><span>12 Mar</span><span>14 Mar</span><span>16 Mar</span><span>18 Mar</span></div></div></div></section>
  <section class="card">${header('Sentiment by day','Share of sample posts')}<div class="card-b stack">${[34,41,46,52,48,45].map((n,i)=>`<div class="sent-row"><span>${i+13} Mar</span><meter min="0" max="100" value="${n+issues.indexOf(issue)*2}" aria-label="Negative share"></meter><small>${n+issues.indexOf(issue)*2}%</small></div>`).join('')}<div class="muted">■ Negative &nbsp; ■ Neutral &nbsp; ■ Positive</div></div></section></div>
  <section class="card">${header('By source','Sample source groups')}<div class="card-b">${table(['Source','Mentions','Reposts','Est. reach','Net sentiment','Virality'],sources.slice(0,5).map(([,label,,icon],i)=>[`${icon} ${label}`,small(issue.mentions*(5-i)/15),small(issue.reposts*(5-i)/15),i<2?'Sample high':'Sample low',issue.sentiment+i*3,issue.score-i*4]))}</div></section>
  <div class="split"><section class="card">${header('Posts driving it','Ranked within the fictional replay')}<div class="card-b">${table(['Post','Source','V'],posts.slice(0,5).map(p=>[issue.id==='flood'?p.title:`${issue.name}: observation ${p.id}`,p.label,p.score]))}</div></section>
  <section class="card">${header('Collectors','Sample collector profiles')}<div class="card-b stack"><p><b>Topic sweep</b><small>Five source groups · ${issue.interval} · ${cost(240000)} sample cap</small></p><p><b>Account watch</b><small>Two sample accounts · ${cost(80000)} sample cap</small></p><p><b>Weather watch</b><small>Resume the next sample batch when the exercise starts.</small></p></div>${header('Alert rules')}<div class="card-b stack"><p><b>Virality above 75</b><small>Notify the sample reviewer after two refreshes.</small></p><p><b>Access discussion rises</b><small>Flag the issue in the sample workspace.</small></p></div></section></div></div>`;
  return `<div class="monitor-layout"><aside class="issues"><div class="lane-meta"><h2>5 issues on schedule</h2>${inactive('Register issue')}</div><div id="issueList" class="stack">${issues.map(i=>btn(`<span><b>${i.name}</b>${pill(i.status,tone(i.status))}</span><small>${i.tracks.length} tracked terms · ${i.interval}</small><span><b>${i.score}</b>${series(trend(i.score,14))}</span>`,'issue',i.id,'issue',press(issue.id===i.id))).join('')}</div></aside>${detail}</div>`;
}

const capBySource = [9800,7600,7200,6400,6100,5700,5400,5000,4600];
const platformCap = 64000;
const newsCap = 72000;
const platformRate = 80;
const newsRate = 120;

function spendChart(display) {
  const bars = daySpend.map(([research,collectors],i)=>{
    const baseline=236;
    const height=amount=>amount/800000*202;
    const x=95+i*90;
    const lower=baseline-height(research);
    const upper=lower-height(collectors);
    return `<g><title>${i+13} Mar · ${display(research)} research · ${display(collectors)} collectors</title><rect class="bar-research" x="${x}" y="${lower}" width="42" height="${height(research)}"/><rect class="bar-collectors" x="${x}" y="${upper}" width="42" height="${height(collectors)}"/><text class="bar-label" x="${x+21}" y="${upper-7}">${display(research+collectors)}</text><text class="bar-label" x="${x+21}" y="254">${i+13} Mar</text></g>`;
  });
  const scale = [800000,600000,400000,200000,0].map((amount,i)=>{
    const y=34+i*50.5;
    return `<path d="M72 ${y}H610"/><text x="66" y="${y+3}">${display(amount)}</text>`;
  });
  return `<svg class="spend-graph" viewBox="0 0 620 265" role="img" aria-label="Six-day stacked synthetic spend chart">${scale.join('')}${bars.join('')}</svg>`;
}

export function costs(state) {
  const {currency,saved,active} = state;
  const cost = n=>money(n,currency);
  const display = n=>concise(n,currency);
  const current = active ? saved.find(run=>run.id===active) : null;
  const rows = current ? [current,...history] : history;
  const upcoming = [['Workspace cap per month',cost(cap)],...capBySource.map((n,i)=>[`Default cap · ${sources[i][1]}`,cost(n)]),['Warn the run owner at','85%'],['Sample FX rate',`Rp ${small(rate)} per US$1`]];
  const capRows = sources.slice(0,9).map(([,label,,glyph])=>[`${glyph} ${label}`,cost(platformRate),current?'Stored sample run':'No active sample run',`${cost(0)} of ${cost(platformCap)}`,'0']);
  const shares = [27,21,14,8,5,25];
  const splits = shares.map((n,i)=>{
    const amount = Math.round(monthSpend*n/100);
    const count = (6-i)*3200;
    return [[...sources.map(x=>x[1]).slice(0,4),'News & articles','Sample scoring'][i], small((6-i)*132), i===5?'–':small(count), cost(amount), i===5?'–':cost(Math.round(amount*1000/count)), `${n}%`];
  });
  return `<div class="stack">
  <div class="four">${kpi('Spent in March',display(monthSpend),`of ${display(cap)} workspace cap`)}${kpi('Live research',display(researchSpend),'Sample plan totals')}${kpi('Collectors',display(collectorSpend),'Sample collector totals')}${kpi('Cost per 1,000 posts',display(Math.round(monthSpend/64)),'Illustrative effective cost')}</div>
  <div class="cost-layout"><section class="card">${header('Spend by day','March, sample scoring included')}<div class="card-b">${spendChart(display)}<div class="chart-legend"><span>■ Live research</span><span>■ Collectors</span></div></div></section>
  <section class="card">${header('Budget policy','',inactive('Edit'))}<div class="card-b definition">${upcoming.map(([key,value])=>`<div><span>${key}</span><b class="mono">${value}</b></div>`).join('')}</div></section></div>
  <section class="card">${header('Platform budgets','Fictional searches and caps',inactive('Edit caps'))}<div class="card-b">${table(['Platform','Per call','This run','This month','Cached'],capRows)}</div></section>
  <section class="card">${header('Cost controls','Configured examples')}<div class="card-b">${table(['Source','State','This month','Action'],[...sources.slice(0,9).map(([,label])=>label),'Sample scoring'].map(label=>[label,pill('Sample active','good'),`${cost(0)} of ${cost(platformCap)}`,inactive('Pause')]))}</div></section>
  <p class="muted">News and articles use a separate sample cap of ${cost(newsCap)}, shown in <a href="#settings">Settings</a>.</p>
  <section class="card">${header('Free allowance','Fictional monthly call allowance')}<div class="card-b stack"><progress max="8400" value="0" aria-label="Free calls used"></progress>${table(['Free calls left','Resets','Billed after allowance','Cap treatment'],[['8,400','1 Apr 2031, 09:00','0 calls · '+cost(0),'Not counted']])}</div></section>
  <section class="card">${header('Spend by source','March to date')}<div class="card-b">${table(['Source','Calls','Posts','Spent','Per 1,000 posts','Share of spend'],splits)}</div></section>
  <section class="card" id="run-history">${header('Runs and batches','Stored example ledger · reopen adds an active-run row')}<div class="card-b">${table(['ID','Kind','Query or issue','Sources','Cap','Spent','Used','Status','Started by','Started'],rows.map(r=>[btn(r.id,'ledger',r.id,'mono'),r.kind,escape(r.topic),r.kind==='Collector'?'Sample collectors':'Sample sources',cost(r.cap),cost(r.spent),`${Math.floor(r.spent/r.cap*100)}%`,pill(r.status,r.status==='Complete'?'good':'warn'),r.owner,r.time]),'Runs and batches')}</div></section></div>`;
}

export function ledger(run, currency) {
  const cost = n=>money(n,currency);
  const ifUsing = run.sources || sources.map(([id])=>id);
  const breakdown = sources.filter(([id])=>ifUsing.includes(id));
  const portion = Math.floor(run.spent/breakdown.length);
  const lines = breakdown.map(([,label,count],i)=>[label,`${run.kind==='Collector'?'Stored batch':'Sample call'} ${i+1}`,run.kind==='Collector'?'–':count,cost(portion+(i===0?run.spent-portion*breakdown.length:0))]);
  return `<div class="drawer-head"><h2 id="ledger-title">Run ledger</h2>${btn('Close','close-ledger')}</div><div class="card-b stack"><b>${escape(run.topic)}</b><p class="mono">${run.id} · ${run.time}</p>${table(['Status','Cap','Sample spent'],[[run.status,cost(run.cap),cost(run.spent)]])}${table(['Source','Record','Replay results','Sample cost'],lines)}<p>Reopening a run shows its stored ledger without adding spend.</p></div>`;
}

const checks = {
  en:['Answer first','Action titles','Every fact attributed','Evidence graded','Every exhibit captioned','Sample figures','Generated source list','Volume and sentiment'],
  id:['Jawaban di awal','Judul tindakan','Atribusi bukti','Penilaian bukti','Keterangan gambar','Angka contoh','Daftar sumber rekaan','Volume dan sentimen'],
};
const reportWords = {
  en:{brief:'FICTIONAL DESK BRIEF',scope:'Sample coverage', evidence:'Example evidence', analysis:'Narrative assessment',close:'Review action', notes:'Page notes', chart:'Illustration from the sample scenario', message:'Use the exercise record to trace route changes, the sample response and the proposed follow-up.'},
  id:{brief:'RINGKASAN REKAAN',scope:'Cakupan sampel', evidence:'Bukti contoh', analysis:'Penilaian narasi',close:'Tindakan peninjauan', notes:'Catatan halaman', chart:'Ilustrasi dari skenario sampel', message:'Gunakan catatan latihan untuk menelusuri perubahan rute, tanggapan, dan usulan tindak lanjut.'},
};
export function reports(state) {
  const {language,reportPage} = state;
  const entries = reportSections[language];
  const [section,title,note] = entries[reportPage-1];
  const words = reportWords[language];
  const figure = reportPage === 2 ? `<ol>${entries.map(([label])=>`<li>${label}</li>`).join('')}</ol>` : reportPage === 6 ? `<div class="report-map" aria-label="Fictional route diagram"><span>Quay</span><span>Canal</span><span>Market</span><span>Plaza</span></div>` : reportPage === 13 ? `<ol>${sources.map(([,label,count],n)=>`<li>S${n+1} · ${label} · ${count}</li>`).join('')}</ol>` : series(trend(reportPage,12),'line',true);
  return `<div class="studio"><aside class="card report-options"><div class="card-b stack">
  <label for="report-source">Built from</label>${select('report-source',[['desk','Desk research · Harbor Quarter flooding']],'desk')}
  <div class="split"><div><label for="audience">Audience</label>${select('audience',[['review','Stakeholders']],'review')}</div><div><label for="rLang">Language</label>${select('rLang',[['en','English'],['id','Bahasa Indonesia']],language)}</div></div>
  <b>Sections</b><div class="sections">${entries.map(([label],i)=>btn(`<span>▤</span> ${label}<small>p${i+1}</small>`,'report-page',i+1,'section-btn',`data-pg="${i+1}" ${reportPage===i+1?'aria-current="page"':''}`)).join('')}</div>
  <div class="batch"><b>Draft ready for review</b><p>220 fictional results · 10 source groups · 26 bilingual pages</p></div></div></aside>
  <div class="viewer"><div class="viewer-bar">${btn('‹','report-page',reportPage-1,'',`aria-label="Previous report page" ${reportPage===1?'disabled':''}`)} <span id="pgn" class="mono">${reportPage} / ${entries.length}</span> ${btn('›','report-page',reportPage+1,'',`aria-label="Next report page" ${reportPage===entries.length?'disabled':''}`)}<div class="right">${inactive('Regenerate section')}${inactive('Export PDF')}</div></div>
  <div class="report-stage"><article id="reportPaper" class="report-paper" lang="${language}"><header><small>RADAR · ${words.brief}</small><small>${String(reportPage).padStart(2,'0')} / 13</small></header><p class="eyebrow">${section}</p><h2>${title}</h2><p class="report-callout">${note}</p><dl><dt>${words.scope}</dt><dd>${words.message}</dd><dt>${words.evidence}</dt><dd>${note}</dd><dt>${words.analysis}</dt><dd>${words.message}</dd></dl><figure>${figure}<figcaption>${words.chart} · S${(reportPage-1)%sources.length+1}</figcaption></figure><p><b>${words.close}</b> ${note}</p><footer>RADAR · Sample Mode · ${date}</footer></article></div>
  <div class="thumbs" aria-label="Report pages">${entries.map(([label],i)=>btn(`<span>▤</span><small>${i+1}</small>`,'report-page',i+1,'thumb',`aria-label="${escape(label)}" ${reportPage===i+1?'aria-current="page"':''}`)).join('')}</div></div>
  <aside class="stack report-notes"><section class="card">${header('Quality checks','run before export')}<ul class="card-b check-list">${checks[language].map((check,i)=>`<li><span>●</span><div><b>${check}</b><small>${i%2===0?words.message:words.chart}</small></div></li>`).join('')}</ul></section><section class="card">${header(words.notes)}<p id="pgNote" class="card-b muted">${note}</p></section></aside></div>`;
}

export function users() {
  return `<div class="stack"><section class="card">${header('People with access','4 active · 2 admins',inactive('Add user'))}<div class="card-b">${table(['User','Role','Status','Added by','Last sign-in'],people.map(person=>[`<b>${person.name}</b><small>${person.email}</small>`,pill(person.role),pill(person.status,person.status==='Active'?'good':'neutral'),`${person.by} · ${person.added}`,person.last]))}</div></section>
  <section class="card">${header('Access changes','Fictional history, newest first')}<div class="card-b">${table(['When','By','Change'],accessChanges)}</div></section></div>`;
}

export function settings(state) {
  const cost = n=>money(n,state.currency);
  const settingsRows = [['This month',`${cost(0)} of ${cost(newsCap)}`],['Rate',`${cost(newsRate)}/sample unit`],['Pull today’s news',select('sync-every',[['two','Every 2 hours']],'two')],['Last sync','Never'],['Next sync','Sample timer disabled'],['Days searchable','30 sample days']];
  return `<div class="stack"><p class="muted">Settings display fictional connector and organisation records.</p>
  <section class="card">${header('News & articles','Sample headlines for the replay',inactive('Edit cap'))}<div class="card-b definition">${settingsRows.map(([label,value])=>`<div><span>${label}</span><span class="mono">${value}</span></div>`).join('')}<p>${inactive('Sync now')}</p><p class="muted">News uses the bundled sample set.</p>${table(['Source','State','This month','Action'],[['News pull',pill('Sample active','good'),'–',inactive('Pause')],['News backfill',pill('Sample active','good'),'–',inactive('Pause')]])}
  <p class="muted">The visible controls illustrate settings for a connector. The sample contains no scheduled tasks.</p><h3>Last 10 syncs</h3>${table(['Started','Status','Headlines','Cost'],[['–','No syncs yet','–','–']])}<div><label for="keep">Keep vectors for</label>${select('keep',[['sample','Sample headline lifetime']],'sample')}</div><p class="muted">0 vectors on disk. All eight news records are in the replay.</p></div></section>
  <section class="card">${header('Organisations','Who “Stories and posts about” can mean',inactive('Add organisation'))}<div class="card-b stack"><p class="muted">Sample profiles show how aliases and exclusions are presented.</p>${table(['Organisation','Names the press uses','Excluded','Changed'],[['<b>Harbor Quarter Workspace</b><small>Social: harbor quarter, harbor sample</small>','Harbor Quarter, Harbor Walk, Lantern Quay, East Basin, Harbor Transit, Basin Footbridge','North Landing Project, Upper Pier Company','16 Mar'],['<b>Marshlight Homes</b><small>Social: marshlight, marsh homes</small>','Marshlight Homes, Lantern Point Studios, Willow Court, Rill Lane','–','17 Mar']])}</div></section></div>`;
}

export function profile() {
  const person = people[0];
  return `<div class="stack"><section class="card">${header('Your account','From Sample Mode and demo access')}<div class="card-b"><dl class="profile-fields">${[['Name',person.name],['Email',person.email],['Role',pill(person.role)],['Status',pill(person.status,'good')],['Added by',`${person.by} · ${person.added}`],['Last sign-in',person.last],['Last MFA approval','Not applicable']].map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl><p class="muted">Role and status are illustrative.</p></div></section>
  <section class="card">${header('Your access changes','Sample timeline, newest first')}<div class="card-b">${table(['When','By','Change'],accessChanges.filter((_,i)=>i!==1))}</div></section>
  <section class="card signout"><div><b>Sign out</b><p class="muted">Ends this demo session on this device.</p></div>${btn('↪ Sign out','signout','','','data-signout')}</section></div>`;
}
