const find = (selector) => document.querySelector(selector);
const reviewAnchors = {
  'research-plan': '#planCard',
  'research-scan-plan': '#planCard',
  'research-results': '#runCard',
  'research-ledger': '#runCard',
};

function navigate(page) {
  location.href = './' + page + '.html' + (reviewAnchors[page] || '');
}

function showReportPage(page) {
  const language = find('#rLang').value;
  const pages = window.RADAR_REPORT_DISPLAY[language].pages;
  const current = pages[page - 1];
  if (!current) return;

  find('#pgn').textContent = page + ' / ' + pages.length;
  find('#pPrev').disabled = page === 1;
  find('#pNext').disabled = page === pages.length;
  find('#pgImg').src = current.src;
  find('#pgImg').alt = current.alt;
  find('#pgNote').textContent = current.note;
  document.querySelectorAll('#v-reports [data-pg]').forEach(item => {
    item.setAttribute('aria-current', Number(item.dataset.pg) === page);
  });
  const strip = find('#thumbs');
  const thumbnail = strip.querySelector('[data-pg="' + page + '"]');
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  strip.scrollTo({left: thumbnail.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + 38, behavior});
}

function changeReportLanguage() {
  const current = Number(find('#pgn').textContent.split('/')[0]);
  const language = window.RADAR_REPORT_DISPLAY[find('#rLang').value];
  find('.sections').outerHTML = language.tabs;
  find('#thumbs').outerHTML = language.thumbnails;
  showReportPage(current);
}

const feed = {sort: 'new', source: 'all', page: 1};

function showFeed() {
  const result = window.RADAR_RESEARCH_DISPLAY[feed.sort][feed.source];
  feed.page = Math.max(1, Math.min(result.pages.length, feed.page));
  const current = result.pages[feed.page - 1];
  find('#feed').outerHTML = current.html;
  find('#feedStat').innerHTML = current.stat;
  find('#feedRange').innerHTML = current.range;
  find('#feedCtl').hidden = current.hidden;
  find('#sortNew').setAttribute('aria-pressed', feed.sort === 'new');
  find('#sortVir').setAttribute('aria-pressed', feed.sort === 'vir');
  document.querySelectorAll('#feedTabs [data-ft]').forEach(tab => {
    tab.setAttribute('aria-pressed', tab.dataset.ft === feed.source);
  });
}

function changeFeed(control) {
  if (control.dataset.ft) {
    feed.source = control.dataset.ft;
    feed.page = 1;
  } else if (control.id === 'sortNew' || control.id === 'sortVir') {
    feed.sort = control.id === 'sortVir' ? 'vir' : 'new';
    feed.page = 1;
  } else if (control.dataset.pg === 'prev') {
    feed.page--;
  } else if (control.dataset.pg === 'next') {
    feed.page++;
  } else {
    feed.page = Number(control.dataset.pg);
  }
  showFeed();
}

document.addEventListener('click', event => {
  const control = event.target.closest('[data-review], [data-signout], [data-presentation-link], #lgTheme, #v-reports [data-pg], #pPrev, #pNext, #feedTabs [data-ft], #feed [data-pg], #sortNew, #sortVir');
  if (!control) return;

  if (control.hasAttribute('data-presentation-link')) {
    event.preventDefault();
    return;
  }
  if (control.hasAttribute('data-signout')) {
    navigate('index');
    return;
  }
  if (control.dataset.review) {
    navigate(control.dataset.review);
    return;
  }
  if (control.id === 'lgTheme') {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    control.textContent = root.dataset.theme === 'dark' ? 'Light mode' : 'Dark mode';
    return;
  }
  if (window.RADAR_REPORT_DISPLAY && control.closest('#v-reports')) {
    const current = Number(find('#pgn').textContent.split('/')[0]);
    showReportPage(Number(control.dataset.pg) || current + (control.id === 'pPrev' ? -1 : 1));
    return;
  }
  if (window.RADAR_RESEARCH_DISPLAY && control.closest('#v-research')) changeFeed(control);
});

find('#rLang')?.addEventListener('change', changeReportLanguage);
const pager = find('#feed');
if (pager) {
  const current = pager.querySelector('[aria-current]');
  const tab = find('#feedTabs [aria-pressed=true]');
  feed.page = Number(current?.dataset.pg) || 1;
  feed.source = tab?.dataset.ft || 'all';
  feed.sort = find('#sortVir')?.getAttribute('aria-pressed') === 'true' ? 'vir' : 'new';
}
