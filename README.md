# Appliance Energy Calculator

[Try it in your browser](https://rmb7t2jfp7-creator.github.io/appliance-energy-calculator/) · [Test results](https://github.com/rmb7t2jfp7-creator/appliance-energy-calculator/actions)

Compare a baseline and an alternative appliance setup using power draw, hours per day, a shared number of days, and your own electricity price. The interface calls itself **watt / wise**.

## Run it

Download the repository and open `index.html` in a modern browser. No installation, external libraries, API keys, tracking, or account is required. To use a stable local origin, optionally run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000`. Static hosting also works. Keep using the same browser and address to access the same saved setups.

## Built and working

- Compare energy and variable energy cost for two wattage/schedule assumptions.
- See the actual input numbers, units, formula, signed direction of the difference, and percentage comparison.
- Handle increases as increases, and show an undefined percentage when the baseline is zero.
- Save, load, update, and delete named setups in browser local storage.
- Export/import strictly validated, versioned JSON backups. Replacement imports and deletions require confirmation. Invalid imports leave stored setups unchanged.
- See visible storage errors; export unreadable stored data for recovery when possible.
- Load a separate, clearly fictional example; saving is disabled in demo mode.

The calculator starts blank. Placeholder numbers and the optional example are illustrative, not claims about your appliances or utility prices. Supply every field, including the currency label and rate. Enter one consistent currency per setup; no conversion or live prices are provided.

## Method and interpretation

```
daily kWh = power in watts × hours per day ÷ 1,000
period kWh = daily kWh × days
period cost = period kWh × price per kWh
difference = baseline − alternative
percentage change = difference ÷ baseline × 100 (when baseline is nonzero)
```

Both scenarios use the same period and flat electricity rate. Arithmetic uses unrounded numbers; the interface shows energy to at most three decimal places, costs to two, and percentage to one. Very small changes can round to zero. At most 100 setups and 1 MB imports are supported. Wattage: 0–1,000,000; hours/day: 0–24; whole days: 1–3,660; rate: 0–1,000 currency units per kWh. Nonzero numeric values must be at least 0.000000001 to avoid numerical underflow and overflow in percentage comparisons.

[Virginia Cooperative Extension’s appliance-energy guidance](https://spes.vt.edu/content/pubs_ext_vt_edu/en/2901/2901-9014/2901-9014.html) explains the watts × hours ÷ 1,000 conversion and cost estimation. This project is not affiliated with or endorsed by that organization.

These are **scenario estimates**, not meter readings or verified savings. Use average operating watts where known; nameplate wattage may describe maximum draw. Cycling appliances, different operating modes, and standby consumption can make a simple constant-power model inaccurate. Standby must be reflected in the supplied average power if you want it included. Fixed charges, taxes, tiered tariffs, time-of-use rates, purchase/installation costs, rebound effects, and emissions are outside scope. A cheaper modeled scenario does not establish an actual bill reduction or environmental outcome.

## Privacy and backups

Data stays in browser local storage. Storage is tied to the browser profile and site/origin; file opening, localhost, and a hosted copy may use separate stores. There is no cloud synchronization or telemetry. Use one tab at a time to avoid overwriting changes from another tab. Browser data can be cleared or become unavailable, so export backups regularly. Exports contain setup names and assumptions. Opening the reference link is the only intentional external navigation; the app itself makes no network requests beyond loading its local/static files.

## Development and status

With Node.js 18 or newer, run `npm test` or `node --test core.test.js`. There are no dependencies to install. `core.js` provides the shared pure calculation and validation functions; `app.js` handles text-only DOM rendering and browser storage. Tests cover dimensional calculations, cost differences, increases, zero baselines, numeric bounds, malformed/oversized imports, duplicates, and malicious-looking strings.

Initial implementation and documentation were developed with AI assistance. This repository claims no prior human review, real-world users, measured energy savings, adoption, or environmental impact. Possible future work, not implemented: separate standby periods, additional tariff structures, and measured-data import. Contributions are welcome through issues and pull requests; avoid sharing private bills or personal information.

MIT licensed; see `LICENSE`.
