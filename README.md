# RADAR Static Interactive Demo

**RADAR PROTOTYPE — SAMPLE DATA ONLY**

The prototype runs entirely in a browser using fictional data. Continue as Avery Vale, plan a Harborlight transit search, then follow the sample activity through Monitor, Runs & costs, and Reports.

## Run locally

From the checkout, create a loopback-only static preview with the same subdirectory layout used by GitHub Pages.

```sh
preview=$(mktemp -d)
target="$preview/radar_scheduler_prototipe"
mkdir "$target"
for entry in index.html assets css data js; do
  ln -s "$PWD/$entry" "$target/$entry"
done
python3 -m http.server 8766 --bind 127.0.0.1 --directory "$preview"
```

Open [http://127.0.0.1:8766/radar_scheduler_prototipe/](http://127.0.0.1:8766/radar_scheduler_prototipe/) in a modern browser. Use `Ctrl+C` in the preview terminal to stop it. The static file server is only for preview. No build or backend is involved, and the site uses relative paths and hash links. Opening `index.html` through `file://` can block the modules and JSON in browsers.

## Suggested walkthrough

1. Continue to Demo. Choose **Harborlight transit**, select sources, and review the plan.
2. Start the simulation, filter the results, save the run, and reopen it from Saved research.
3. In Monitor, choose an issue and simulate a collection. Then check the sample ledger and currency display in Runs & costs.
4. Open Reports and review the fictional evidence in the prepared issue brief.
5. Visit Users, Settings, or Profile to demonstrate local administration and sign-out.

Changes persist in the current browser and origin. Saved runs keep approved fixture keywords or a generic sample topic label. Free-text keywords stay in memory in the current tab. Users and issues are added from fictional fixture catalogs. **Reset saved research** removes saved snapshots while retaining run history and simulated costs. **Reset Demo Data** in Settings clears the entire demo state for that origin.

See [feature inventory and differences](FEATURES.md) and [security and publication review](SECURITY-REVIEW.md).

## GitHub Pages after approval

The existing destination is `wijayafran/radar_scheduler_prototipe`. For branch-based publishing of this buildless site, choose **Settings → Pages → Deploy from a branch**, select the approved `feature/radar-static-demo` branch and **/(root)**, then save. The root `.nojekyll` file serves the static entry point as-is. The expected project URL is `https://wijayafran.github.io/radar_scheduler_prototipe/`.

GitHub Pages remains unconfigured. Confirm the account’s Pages eligibility and approval to publish publicly before enabling it. GitHub can serve Pages publicly from an eligible private repository. The mock landing screen serves as an entry point for the demo. [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
