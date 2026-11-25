# Design

The prototype borrows RADAR’s overall screen hierarchy and dashboard patterns. The graphic mark, icons, screens, copy, and datasets are independently authored for this demo.

- The desktop workspace uses a fixed-width navigation rail and a flexible work area. The rail becomes keyboard-operable collapsible navigation below 880px, and multi-column forms stack on smaller screens.
- Color tokens live in `css/styles.css`. Deep navy `#0d1727` anchors the page, `#152338` distinguishes panels, and mint `#67e3c7` marks active controls and main chart series. Words accompany status colors.
- Research pairs a composer with a running estimate, then focuses the resulting progress and completed sections. Native dialogs support escape and focus return. Data tables scroll within labeled regions.
- The system font stack, CSS, original SVG mark, icons, and vector charts keep the interface local. Reduced motion settings shorten decorative transitions while preserving progress feedback.
