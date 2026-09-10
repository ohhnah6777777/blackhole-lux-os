# Blackhole Web Portal Launcher

## Browser redesign
- Remove all iframe, proxy, direct-loading, and embedded-page code from Blackhole Browser.
- Replace the viewing area with a polished portal dashboard containing a live digital clock, secure-gateway status, and a prominent search field.
- Add destination tiles for Google, YouTube, GitHub, Reddit, Wikipedia, Netflix, and ChatGPT.

## Navigation behavior
- Open searches in a new browser tab using DuckDuckGo with a safely encoded query.
- Open every destination tile in a new tab with `noopener,noreferrer` protection.
- Keep the sidebar and tab-inspired visual structure, but represent launcher shortcuts rather than embedded browsing history.

## Settings cleanup and validation
- Remove the proxy URL state, proxy controls, and Browser settings inputs.
- Replace Browser settings with a short description of secure external-tab launching.
- Verify searches and destination tiles request the correct external URLs, no iframe remains, and the preview builds cleanly.
