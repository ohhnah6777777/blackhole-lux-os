# Blackhole OS

Create a premium, ultra-minimalist web operating system called "Blackhole OS". 

The aesthetic must be a blend of macOS and Windows 11: a highly sophisticated, clean, monochromatic dark mode. Use absolute pitch-black (#000000) for app backgrounds, stark crisp white text, subtle fine-lined dark borders (1px border-neutral-800), and heavy backdrop blur (glassmorphism) for panels. No neon, no futuristic sci-fi effects—just pure, modern luxury software design.

Please build the core OS infrastructure with the following features:

1. THE DESKTOP ENVIRONMENT: 

   - A clean, dramatic high-contrast dark wallpaper (or a deep monochrome gradient).

   - A floating, glassmorphic bottom Dock (like macOS) that subtly expands icons on hover. Include icons for Browser, File Manager, and System Settings.

   - A minimalist top menu bar (like macOS) showing "Blackhole OS" on the left, and a clean digital clock/system toggles on the far right.

2. THE "BLACKHOLE" WEB BROWSER:

   - Clicking the browser opens a sleek, borderless window with smooth, native-feeling dragging and resizing.

   - Window controls in the top left: a minimalist close, minimize, and maximize button (styled cleanly like macOS or Windows 11).

   - Browser UI features a sidebar layout (like Arc Browser) for tabs and bookmarks to keep the main view clean.

   - A centered, pill-shaped URL address bar at the top with back, forward, and refresh controls.

   - The main viewing area uses an <iframe> configured with a fallback CORS proxy (like api.allorigins.win) so it can successfully pull in web content. Set the default homepage to a gorgeous, clean "New Tab" dashboard featuring a minimalist search bar and a few neat bookmark tiles (e.g., Wikipedia).

3. OS WINDOW MANAGEMENT:

   - Ensure windows stack properly with realistic, subtle drop shadows (shadow-2xl) to separate them from the background.

   - Transitions for opening, closing, and minimizing windows must be snappy and fluid (using clean Tailwind transitions or standard React state animation).

Focus heavily on typography, spacing, padding, and layout alignment to make it look like a real, professionally engineered desktop OS.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a9641474-739e-40a9-93af-04510a753a35).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
