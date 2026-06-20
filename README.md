# Glass OS - Basic Web OS

A lightweight, browser-based operating system built with HTML, CSS and vanilla JavaScript. Glass OS provides a simple, polished desktop-like environment that runs entirely in the browser — ideal as a learning project and a proof-of-concept for a web-based OS UI.

## What's new (recent commits)

This README was updated to reflect the latest additions in the repository (index.html, styles.css, script.js):

- Multi-window desktop with draggable, resizable windows and a macOS/Windows-style dock
- File Explorer and Text Editor with save/load support (files persist in browser localStorage)
- Terminal (simulated shell), Notes app, Music player, and a built-in Web Browser iframe
- Lock screen with user profiles (Aster, Orion, Luna) and a boot/welcome flow
- Multiple wallpapers and theme support (light and dark) with keyboard shortcuts
- Desktop context menu, notifications, search overlay, and floating widgets (Weather, Calendar, System Info)

## Features

- Polished glassmorphism UI (CSS) and responsive layout
- Multiple built-in apps: Files, Browser, Notes, Terminal, Music, Settings, Editor
- Draggable desktop icons and windows; window maximize/snap behavior
- Wallpaper cycling and selection, light/dark themes
- State persistence in localStorage (key: `glass-os-state-v1`)
- Keyboard shortcuts: Ctrl/Cmd+F — Search, Ctrl/Cmd+L — Lock screen, Esc — Close overlays
- Simple AI Assistant panel placeholder and app launcher integration

## Project structure

- index.html — main UI and app windows
- styles.css — glassy UI theme and responsive styles
- script.js — app logic, state management, and event bindings

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/A-aaron207/Glass-OS---Basic-Web-OS.git
   cd Glass-OS---Basic-Web-OS
   ```

2. Open the app in your browser:

   - Option A: Open `index.html` directly in a modern browser (works locally for most features).
   - Option B (recommended for best results): Serve the folder with a simple HTTP server to avoid iframe / file restrictions:

     ```bash
     # Python 3
     python -m http.server 8000
     # then open http://localhost:8000
     ```

3. Use the welcome screen "Enter Glass OS" button to boot the environment. Try the dock apps, right-click the desktop for actions, or press Ctrl/Cmd+F to open search.

## Usage notes

- State persistence: app state (open apps, selected wallpaper, files, volume, etc.) is saved in the browser's localStorage under the key `glass-os-state-v1`. Clearing site data will reset the state.
- Profiles: the lock screen includes example profiles (Aster, Orion, Luna) to simulate user switching/locking.
- File saving: files are stored in the in-memory state object and persisted to localStorage — there is no server-side storage.
- Music player: UI and simulated track metadata are included (play/next/previous) — audio playback is not bundled by default.
- Search: the search overlay looks through desktop icons and file names.

## Keyboard shortcuts

- Ctrl / Cmd + F — Open search overlay
- Ctrl / Cmd + L — Lock the desktop
- Esc — Close search / context menus / overlays

## Contributing

Contributions are welcome. If you'd like to propose changes:

1. Fork this repository
2. Create a topic branch for your change
3. Open a pull request describing the feature or fix

Please keep changes compatible with a static-hosted demo (no server-side dependencies required).

## Development notes

- The app is implemented in plain JavaScript (no frameworks) and uses progressive enhancement. The state object is defined in `script.js` and exposes the `storageKey` (`glass-os-state-v1`).
- UI and visuals live in `styles.css` and use CSS custom properties for easy theming.
- The code includes helper functions for desktop icon dragging, window management, notifications, and simple simulated widgets.

## AI usage

AI agents/tools were used to prototype ideas and accelerate parts of the UI (not for core functionality). The repository's JS and CSS contain handcrafted code; references to AI-assisted work are documented here for transparency.

## License

This project is open source. If you intend to add a license, add a `LICENSE` file at the repo root describing the chosen license.

## Author

A-aaron207 (Aaron)
