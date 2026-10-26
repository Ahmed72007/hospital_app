# Hospital Guide (prototype)

> **This is a prototype. All hospitals, doctors, phone numbers and addresses are made-up demo data.**
> The app only points to a department. It does not diagnose or give medical advice.

A mobile-first, installable (PWA) voice app. A visitor picks a language and a hospital, says (or types) the problem, and the app shows and reads out which department to go to, where it is, and how to get there, with phone number, doctors and tips.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview
```

The microphone only works on HTTPS or on `localhost`. To test on a phone, deploy (below) or use a tunnel.
Target browser: Chrome on Android.

## Deploy (free tier)

Vercel:
```bash
npm i -g vercel
vercel --prod
```
Netlify:
```bash
npm i -g netlify-cli
netlify deploy --prod --build
```
(`netlify.toml` is included: build `npm run build`, publish `dist`.)

## Add a hospital
1. Add an entry to `src/data/hospitals.json` (copy an existing one, new `id`).
2. Add its departments to `src/data/departments.json` with that `hospitalId`, a `typeId` from `src/data/types.json`, floor, wing, and directions in each language.
3. Add doctors to `src/data/doctors.json` with the department's `id` as `departmentId`.

## Add a language
1. Copy `src/i18n/en.json` to e.g. `sd.json` and translate every value.
2. Add one line in `src/i18n/index.ts`: `sd: { label: 'سنڌي', dir: 'rtl', speech: 'sd-PK', strings: sd }`.
3. Add that language's text to every `{ en, ur }` object in `src/data/*.json`, and its keywords in `symptoms.json`.
Note: browser voice input/output for Sindhi, Pashto and Punjabi is limited or missing on many phones. The text box and the department picture grid still work.

## How matching works (`src/lib/match.ts`)
Lowercase and trim, then count keywords per department type (`symptoms.json`). Highest count wins; ties go to the more specific type (e.g. Pediatrics before General Medicine). Any critical word (chest pain, accident, سانس, حادثہ, ...) shows Emergency first. No match: spoken message, a picture grid of departments, and the hospital's main phone number.

## Choices made
- Emoji are used as department icons (no image downloads, small bundle). One color per department type.
- Urdu voice output depends on the phone: if no Urdu voice is installed, a Hindi voice is used as a fallback.
- Doctor `days` and `timings` are `{ en, ur }` objects (not plain strings) so they display in Urdu.
- The red Emergency button appears on every screen after a hospital is chosen (it needs a hospital to know which number to call).
- "Reach the hospital" opens Google Maps directions, which Android hands to the maps app.
- A tiny service worker caches pages so the app installs and reopens offline.
- Sample coordinates are fake points near Karachi; "nearest" picks the closest of the three.
