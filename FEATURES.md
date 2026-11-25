# Feature inventory

| Screen | Interactive prototype behavior |
|---|---|
| Sign-in | A landing page opens the Avery Vale demo session. Sign-out returns to the landing page. |
| Live research | Add and remove keywords, select among nine social platforms, turn sample news on or off, choose Scan, Investigate, or Deep Dive, set a simulated run budget, review and confirm a plan, watch progress, filter deterministic fixture results, and save or reopen completed research. Reset saved research independently from the run ledger. |
| Monitor | Five starting issues with selectable virality and sentiment views, collector readiness, a simulated Collect now action, editable virality thresholds, and registration from fictional issue templates. |
| Runs & costs | A June 2026 sample ledger, daily spending chart, run history, platform caps and pause/resume controls, and a shared IDR/USD display toggle. |
| Reports | Three sections of authored English and Indonesian sample copy, previous/next and direct section navigation, fictional evidence references, an audience selector for review context, and a persistent quality checklist. |
| Users | Add a fictional invitee, edit their role and status, and inspect local audit entries. The sample directory retains one active administrator. |
| Settings | Fictional organisation profiles, a simulated news interval and manual sync, shared pause/cap controls, a workspace monthly cap, and full demo reset. |
| Profile | Fictional account details, illustrative account activity, and sign-out. |

## Differences from the RADAR application

- The prototype has client-side state and hash routes. There is no backend, shared data store, or authentication or authorization service. Roles and sign-in are illustrative controls.
- Research plays back a finite collection. Fixture selection is deterministic for the same recognized topic, source settings, and depth. Custom terms use a generic sample topic in persisted records. The demo does not perform text matching against live posts, identify real signals, or run NLP.
- Simulated charges are fixed unit amounts. Planning checks the remaining workspace and per-source caps. The ledger, chart, and run history all derive from the same IDR allocations. USD is display-only at a fixed demo rate of Rp 16,000 per US dollar.
- Collector activity and news sync are local interactions. Neither runs in the background or retrieves articles. Alert threshold changes evaluate the selected sample score on screen.
- The issue brief contains authored examples in two languages. Audience selection records review context. It does not generate or rewrite the brief, and PDF export is outside this prototype.
- Issue registration, user invitations, and organisation additions use predefined fictional choices. There is no shared audit trail or delivery of alerts or invitations.
- State belongs to one browser origin. Separate origins, other devices, and concurrent tabs should be treated as independent demo sessions.
