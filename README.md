# RADAR local static presentation

Open the [local preview](http://127.0.0.1:8770/radar_scheduler_prototipe/). Use the original sign-in button to enter the local presentation. No credentials are collected.

The eight pages use the rendered Sample Mode interface from the operator-started RADAR app. The two captured research plans lead to the existing banjir BSD run. Its feed supports source tabs, sorting and pagination. The saved result opens its original ledger. Monitor offers five captured issue views, Costs and Settings offer IDR and USD views, and Reports offers 13 original pages in each language.

The candidate is for local, authorized internal review. Its original media and displayed records require the operator's approval of a distribution method before any deployment.

## Local preview from this checkout

~~~sh
preview=$(mktemp -d)
site="$preview/radar_scheduler_prototipe"
mkdir "$site"
cp ./*.html .nojekyll "$site/"
cp -R assets css data js "$site/"
python3 -m http.server 8770 --bind 127.0.0.1 --directory "$preview"
~~~
