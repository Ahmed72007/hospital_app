# Hospital Guide (prototype)

Mobile first English and Urdu voice guide for visitors to public hospitals in Karachi. There is no login, backend, appointment booking, or stored patient data. The app only points to a department; it does not diagnose or provide medical advice.

**Demo notice:** floor, wing, route, department phone, doctor and tip data are illustrative. All listed doctors are fictional sample names. Hospital names, main addresses and main phone numbers are listed from public sources. Coordinates are approximate and marked TODO VERIFY in `src/data/hospitals.json`; the emergency contact currently falls back to the hospital's public main number and should be verified before any real use. Do not treat this prototype as an operational hospital directory.

## Run locally

```sh
npm install
npm run dev
npm run build
npm run preview
```

Open `http://localhost:5173`. Microphone access requires HTTPS or localhost. Chrome on Android is the target browser. Speech recognition and Urdu text-to-speech depend on browser support and installed voices; the text input and picture department picker remain available if voice is missing. The service worker caches the app shell for repeat visits.

## Deploy

Netlify (configured by `netlify.toml`): install the CLI, authenticate, then run:

```sh
npm install --global netlify-cli
netlify login
netlify deploy --prod --build
```

Or Vercel:

```sh
npm install --global vercel
vercel login
vercel --prod
```

Both provide HTTPS. Deploying needs an account and login in the CLI. Set the project root to this folder and the build output to `dist` if prompted.

## Data sources and demo data

- [JPMC official contact](https://www.jpmc.edu.pk/contact.php): Rafiqui Shaheed Road address and main phone.
- [Civil Hospital Karachi official site](https://chk.gov.pk/contact.php): Mission Road address and public contact number.
- [Dow University Hospital](https://www.duhs.edu.pk/events/comprehensive-and-specialized-healthcare-services/): Ojha Campus address and contact number.
- [Commissioner Karachi health directory](https://commissionerkarachi.gos.pk/health): Abbasi Shaheed Hospital address and contact number.

The four hospital records are in `src/data/hospitals.json`. Every department has a shared type in `src/data/types.json`; illustrative departments/routes are in `src/data/departments.json`, fictional doctors in `src/data/doctors.json`, and matching/tips in `src/data/symptoms.json` and `src/data/tips.json`.

## Add a hospital

1. Add its bilingual name/address, public phone, and verified map coordinates in `src/data/hospitals.json`. Keep a `TODO VERIFY` marker for anything still unverified.
2. Copy 6–8 department examples in `src/data/departments.json`, update `hospitalId` and unique `id` values, and provide both English and Urdu text.
3. Add fictional demo doctors to `src/data/doctors.json` using the new department IDs.

## Add a language

1. Copy `src/i18n/en.json` to a new JSON file and translate each UI label.
2. Add its language label, text direction, and BCP-47 speech code in `src/i18n/index.ts`.
3. Add the language to bilingual objects in the hospital and department data, plus `src/data/symptoms.json` and `src/data/tips.json`.

Browser voice support for Sindhi, Pashto and Punjabi is limited and depends on the device. Keep the text and picture picker available.

## Matching and UX choices

Input is normalized and matched against `symptoms.json`; the highest keyword score wins, with pediatric routing preferred when the patient is a child. Critical terms route to Emergency. A no-match result opens the department picture grid. Speech highlights words from Web Speech boundary events and estimates progress with a timer when a browser omits those events. Emoji pictograms keep the prototype small; each department type also has a shared color. “Nearest” uses the browser location and approximate hospital coordinates, so verify them before relying on it.
