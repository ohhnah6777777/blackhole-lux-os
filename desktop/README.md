# Blackhole OS Desktop

A standalone desktop build of Blackhole OS. Each browser tab opens as its own
real Chromium window with native back/forward history.

## Run it

```bash
npm install
npm start
```

## Build an installable app for your machine

```bash
npm install
npm run package:mac     # macOS
npm run package:win     # Windows
npm run package:linux   # Linux
```

The finished app appears in `release/`. Double-click it to run — no terminal needed.

By default it loads the hosted Blackhole OS. Point it somewhere else with:

```bash
BLACKHOLE_URL=http://localhost:8080 npm start
```
