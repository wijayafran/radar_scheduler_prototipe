export function icons(name) {
  const paths = {
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
    monitor: '<path d="M2 13h5l3-7 4 12 3-6h5"/>',
    costs: '<path d="M3 20h18M6 16V9m6 7V4m6 12v-5"/>',
    reports: '<path d="M6 3h8l4 4v14H6zM13 3v5h5M9 12h6m-6 4h6"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-14a3 3 0 0 1 0 6m1 2a5 5 0 0 1 4 5"/>',
    settings: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
    profile: '<circle cx="12" cy="8" r="3"/><path d="M5 20v-1a7 7 0 0 1 14 0v1"/>',
    plus: '<path d="M12 5v14m-7-7h14"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    next: '<path d="m9 6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    shield: '<path d="m12 3 7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    play: '<path d="m8 5 12 7-12 7z"/>',
  };
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] ?? paths.search) + '</svg>';
}

export function lineChart(values, label, maximum, tickLabel) {
  const [width, top, bottom, left, right] = [640, 18, 162, 70, 622];
  const x = index => left + (right - left) * index / Math.max(1, values.length - 1);
  const y = value => bottom - (bottom - top) * value / maximum;
  const points = values.map((value, index) => [x(index), y(value)]);
  const line = points.map(point => point.join(',')).join(' ');
  const bars = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const at = y(maximum * ratio);
    return '<path class="gridline" d="M' + left + ' ' + at + 'H' + right + '"/><text x="0" y="' + (at + 4) + '">' + tickLabel(maximum * ratio) + '</text>';
  }).join('');
  const dates = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const index = Math.round((values.length - 1) * ratio);
    const day = String(18 - values.length + 1 + index).padStart(2, '0');
    const tickClass = ratio === 0.25 || ratio === 0.75 ? ' class="secondary-tick"' : '';
    return '<text' + tickClass + ' x="' + x(index) + '" y="186" text-anchor="middle">' + day + ' Jun</text>';
  }).join('');
  const last = points.at(-1);
  return '<svg class="chart" viewBox="0 0 ' + width + ' 195" role="img" aria-label="' + label + '">'
    + bars + dates + '<polygon class="plot-area" points="' + left + ',' + bottom + ' ' + line + ' ' + right + ',' + bottom
    + '"/><polyline class="plot-line" points="' + line + '"/><circle class="plot-dot" cx="' + last[0] + '" cy="' + last[1] + '" r="4"/></svg>';
}
