const state = {
    activeProfile: 'Aster',
    wallpapers: ['wallpaper-1', 'wallpaper-2', 'wallpaper-3', 'wallpaper-4'],
    wallpaperIndex: 0,
    theme: 'dark',
    battery: 97,
    wifi: 'Online',
    volume: 72,
    notifications: [],
    openedApps: [],
    desktopIcons: [
        { id: 'file-explorer-app', label: 'Files', emoji: '📁', top: 32, left: 32 },
        { id: 'browser-app', label: 'Browser', emoji: '🌐', top: 32, left: 172 },
        { id: 'notes-app', label: 'Notes', emoji: '📝', top: 32, left: 312 },
        { id: 'music-app', label: 'Music', emoji: '🎵', top: 32, left: 452 },
        { id: 'settings-app', label: 'Settings', emoji: '⚙️', top: 172, left: 32 },
        { id: 'terminal-app', label: 'Terminal', emoji: '💻', top: 172, left: 172 }
    ],
    files: [
        { name: 'readme.txt', content: 'Welcome to Glass OS. Your files appear here.' },
        { name: 'notes.txt', content: 'Glass OS text editor supports save and load.' },
        { name: 'todo.txt', content: 'Use the File Explorer or Editor to manage document content.' }
    ],
    musicTracks: [
        { title: 'Glass Horizon', artist: 'Neo Breeze', duration: '3:24' },
        { title: 'Aurora Drift', artist: 'Sky Loop', duration: '4:01' },
        { title: 'Pixel Sunset', artist: 'RetroWave', duration: '2:58' }
    ],
    currentTrackIndex: 0,
    searchResults: [],
    zIndex: 100,
};
const storageKey = 'glass-os-state-v1';
const lockScreen = document.getElementById('lock-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const bootScreen = document.getElementById('boot-screen');
const desktop = document.getElementById('desktop');
const desktopIconsContainer = document.getElementById('desktop-icons');
const desktopContext = document.getElementById('desktop-context');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const notificationContainer = document.getElementById('notification-container');
const themeToggle = document.getElementById('theme-toggle');
const wallpaperSelects = document.querySelectorAll('.wallpaper-select');
const volumeSliders = document.querySelectorAll('.volume-slider');
const batteryStatus = document.getElementById('battery-status');
const wifiStatus = document.getElementById('wifi-status');
const statusSound = document.getElementById('status-sound');
const windowElements = document.querySelectorAll('.window');
const taskbarContainer = document.getElementById('taskbar-open-apps');
const fileList = document.getElementById('file-list');
const fileEditor = document.getElementById('file-editor');
const fileEditorTitle = document.getElementById('editor-filename');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const playButton = document.getElementById('play-button');
const trackMeta = document.getElementById('track-meta');
const notesTextarea = document.getElementById('notes-textarea');
let dragState = null;
let currentOpenFile = null;
loadState();
function loadState() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
    }
    applyTheme();
    applyWallpaper();
    buildDesktopIcons();
    setStatus();
    buildWallpaperOptions();
    applyVolume();
    updateNotifications();
    renderTaskbar();
    renderFiles();
    renderMusic();
    renderAssistant();
    updateSearch();
}
function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
}
function applyTheme() {
    document.body.classList.toggle('theme-light', state.theme === 'light');
    if (themeToggle) {
        themeToggle.textContent = state.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}
function applyWallpaper() {
    document.body.classList.remove('wallpaper-1', 'wallpaper-2', 'wallpaper-3', 'wallpaper-4');
    document.body.classList.add(state.wallpaperIndex < state.wallpapers.length ? state.wallpapers[state.wallpaperIndex] : 'wallpaper-1');
}
function applyVolume() {
    volumeSliders.forEach(slider => {
        slider.value = state.volume;
    });
    const volumeDisplay = document.getElementById('volume-display');
    if (volumeDisplay) volumeDisplay.textContent = `${state.volume}%`;
}
function setStatus() {
    batteryStatus.textContent = `${state.battery}%`;
    wifiStatus.textContent = state.wifi;
}
function buildDesktopIcons() {
    desktopIconsContainer.innerHTML = '';
    state.desktopIcons.forEach(icon => {
        const node = document.createElement('div');
        node.className = 'desktop-icon';
        node.dataset.id = icon.id;
        node.style.top = `${icon.top}px`;
        node.style.left = `${icon.left}px`;
        node.innerHTML = `<div class="icon-emoji">${icon.emoji}</div><div class="icon-label">${icon.label}</div>`;
        node.addEventListener('dblclick', () => openApp(icon.id));
        node.addEventListener('mousedown', event => startDesktopDrag(event, icon, node));
        desktopIconsContainer.appendChild(node);
    });
}
function startDesktopDrag(event, icon, node) {
    event.preventDefault();
    dragState = { icon, node, startX: event.clientX, startY: event.clientY, offsetX: icon.left, offsetY: icon.top };
    node.classList.add('dragging');
    window.addEventListener('mousemove', desktopDrag);
    window.addEventListener('mouseup', stopDesktopDrag);
}
function desktopDrag(event) {
    if (!dragState) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    dragState.icon.left = Math.max(16, dragState.offsetX + dx);
    dragState.icon.top = Math.max(16, dragState.offsetY + dy);
    dragState.node.style.left = `${dragState.icon.left}px`;
    dragState.node.style.top = `${dragState.icon.top}px`;
}
function stopDesktopDrag() {
    if (!dragState) return;
    dragState.node.classList.remove('dragging');
    dragState = null;
    window.removeEventListener('mousemove', desktopDrag);
    window.removeEventListener('mouseup', stopDesktopDrag);
    saveState();
}
function buildWallpaperOptions() {
    wallpaperSelects.forEach(select => {
        select.innerHTML = state.wallpapers.map((wallpaper, index) => `<option value="${index}">Wallpaper ${index + 1}</option>`).join('');
        select.selectedIndex = state.wallpaperIndex;
    });
}
function showContextMenu(event) {
    event.preventDefault();
    const menu = desktopContext;
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.classList.remove('hidden');
}
function hideContextMenu() {
    desktopContext.classList.add('hidden');
}
function getAppTitle(app) {
    return app?.querySelector('.window-title, h2')?.textContent || app?.id || 'App';
}
function openApp(appId) {
    const app = document.getElementById(appId);
    if (!app) return;
    app.style.display = 'flex';
    requestAnimationFrame(() => app.classList.add('show'));
    setAppFocus(appId);
    if (!state.openedApps.includes(appId)) state.openedApps.push(appId);
    renderTaskbar();
    saveState();
    notify(`Opened ${getAppTitle(app)}`);
}
function minimizeApp(appId) {
    const app = document.getElementById(appId);
    if (!app) return;
    app.classList.remove('show');
    setTimeout(() => { app.style.display = 'none'; }, 240);
    state.openedApps = state.openedApps.filter(id => id !== appId);
    renderTaskbar();
    saveState();
}
function closeApp(appId) {
    const app = document.getElementById(appId);
    if (!app) return;
    app.classList.remove('show');
    setTimeout(() => { app.style.display = 'none'; }, 240);
    state.openedApps = state.openedApps.filter(id => id !== appId);
    renderTaskbar();
    saveState();
    hideContextMenu();
}
function toggleMaximize(appId) {
    const app = document.getElementById(appId);
    if (!app) return;
    app.classList.toggle('maximized');
    app.classList.remove('snap-left', 'snap-right');
    setAppFocus(appId);
    saveState();
}
function setAppFocus(appId) {
    const app = document.getElementById(appId);
    if (!app) return;
    windowElements.forEach(win => win.classList.remove('active'));
    app.classList.add('active');
    app.style.zIndex = ++state.zIndex || 100;
    if (!state.openedApps.includes(appId)) state.openedApps.push(appId);
    renderTaskbar();
    saveState();
}
function renderTaskbar() {
    taskbarContainer.innerHTML = state.openedApps.map(id => {
        const app = document.getElementById(id);
        const title = getAppTitle(app);
        return `<button class="taskbar-button" onclick="restoreApp('${id}')">${title}</button>`;
    }).join('');
}
function restoreApp(appId) {
    openApp(appId);
}
function startAppDrag(event, appId) {
    const app = document.getElementById(appId);
    if (!app || app.classList.contains('maximized')) return;
    dragState = {
        app,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: app.offsetLeft,
        offsetY: app.offsetTop,
    };
    document.addEventListener('mousemove', appDrag);
    document.addEventListener('mouseup', stopAppDrag);
}
function appDrag(event) {
    if (!dragState) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    const nextX = Math.min(Math.max(16, dragState.offsetX + dx), window.innerWidth - dragState.app.offsetWidth - 16);
    const nextY = Math.min(Math.max(70, dragState.offsetY + dy), window.innerHeight - dragState.app.offsetHeight - 16);
    dragState.app.style.left = `${nextX}px`;
    dragState.app.style.top = `${nextY}px`;
}
function stopAppDrag() {
    if (!dragState) return;
    document.removeEventListener('mousemove', appDrag);
    document.removeEventListener('mouseup', stopAppDrag);
    dragState = null;
    saveState();
}
function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveState();
    notify(`Switched to ${state.theme} theme`);
}
function changeWallpaper(index) {
    state.wallpaperIndex = Number(index);
    applyWallpaper();
    buildWallpaperOptions();
    saveState();
    notify(`Wallpaper updated`);
}
function notify(title, message = '') {
    const noteObj = { id: Date.now(), title, message };
    state.notifications.push(noteObj);
    if (state.notifications.length > 4) state.notifications.shift();
    updateNotifications();
    saveState();
    setTimeout(() => {
        state.notifications = state.notifications.filter(note => note.id !== noteObj.id);
        updateNotifications();
        saveState();
    }, 4200);
}
function updateNotifications() {
    notificationContainer.innerHTML = state.notifications.map(note => `
        <div class="notification">
            <h4>${note.title}</h4>
            <p>${note.message}</p>
        </div>
    `).join('');
}
function renderFiles() {
    fileList.innerHTML = state.files.map((file, index) => `
        <div class="file-node">
            <span><span class="file-icon">📄</span>${file.name}</span>
            <button class="button-pill" onclick="openFile(${index})">Open</button>
        </div>
    `).join('');
}
function openFile(index) {
    const file = state.files[index];
    currentOpenFile = index;
    fileEditorTitle.textContent = file.name;
    fileEditor.value = file.content;
    openApp('editor-app');
}
function saveFile() {
    if (currentOpenFile === null) return;
    state.files[currentOpenFile].content = fileEditor.value;
    saveState();
    notify('File saved', state.files[currentOpenFile].name);
}
function renderMusic() {
    const track = state.musicTracks[state.currentTrackIndex];
    trackMeta.textContent = `${track.title} — ${track.artist}`;
}
function playMusic() {
    const track = state.musicTracks[state.currentTrackIndex];
    notify('Now playing', track.title);
}
function nextTrack() {
    state.currentTrackIndex = (state.currentTrackIndex + 1) % state.musicTracks.length;
    renderMusic();
    playMusic();
}
function previousTrack() {
    state.currentTrackIndex = (state.currentTrackIndex - 1 + state.musicTracks.length) % state.musicTracks.length;
    renderMusic();
    playMusic();
}
function renderAssistant() {
    const profileList = document.querySelector('#assistant-panel .assistant-profiles');
    if (profileList) {
        profileList.innerHTML = state.desktopIcons.map(icon => `
            <div class="list-item"><span>${icon.emoji} ${icon.label}</span><button class="button-pill" onclick="openApp('${icon.id}')">Open</button></div>
        `).join('');
    }
}
function searchDesktop(query) {
    const lowered = query.toLowerCase();
    const results = [];
    state.desktopIcons.forEach(icon => {
        if (icon.label.toLowerCase().includes(lowered)) results.push({ name: icon.label, action: () => openApp(icon.id) });
    });
    state.files.forEach((file, index) => {
        if (file.name.toLowerCase().includes(lowered)) results.push({ name: file.name, action: () => openFile(index) });
    });
    return results;
}
function updateSearch() {
    const results = searchDesktop(searchInput.value || '');
    searchResults.innerHTML = results.map((result, index) => `
        <div class="search-item" onclick="executeSearchResult(${index})">${result.name}</div>
    `).join('');
    state.searchResults = results;
}
function executeSearchResult(index) {
    const item = state.searchResults[index];
    if (item) item.action();
}
function toggleSearch() {
    searchOverlay.classList.toggle('hidden');
    if (!searchOverlay.classList.contains('hidden')) {
        searchInput.focus();
        searchInput.value = '';
        updateSearch();
    }
}
function lockSystem() {
    lockScreen.classList.remove('hidden');
}
function unlockSystem(profile) {
    state.activeProfile = profile;
    lockScreen.classList.add('hidden');
    notify(`Welcome back, ${profile}`);
}
function showPanel(panelId) {
    document.querySelectorAll('.floating-panel').forEach(panel => panel.classList.add('hidden'));
    document.getElementById(panelId).classList.remove('hidden');
}
function hidePanels() {
    document.querySelectorAll('.floating-panel').forEach(panel => panel.classList.add('hidden'));
}
function cycleWallpaper() {
    state.wallpaperIndex = (state.wallpaperIndex + 1) % state.wallpapers.length;
    applyWallpaper();
    buildWallpaperOptions();
    saveState();
}
function initEventBindings() {
    document.body.addEventListener('contextmenu', event => {
        if (event.target.closest('.desktop-icon')) return;
        showContextMenu(event);
    });
    document.addEventListener('click', () => hideContextMenu());
    document.getElementById('open-files').addEventListener('click', () => openApp('file-explorer-app'));
    document.getElementById('open-settings').addEventListener('click', () => openApp('settings-app'));
    document.getElementById('open-terminal').addEventListener('click', () => openApp('terminal-app'));
    document.getElementById('open-wallpapers').addEventListener('click', () => showPanel('system-panel'));
    wallpaperSelects.forEach(select => {
        select.addEventListener('change', event => changeWallpaper(event.target.value));
    });
    volumeSliders.forEach(slider => {
        slider.value = state.volume;
        slider.addEventListener('input', event => {
            state.volume = Number(event.target.value);
            applyVolume();
            saveState();
        });
    });
    themeToggle.addEventListener('click', toggleTheme);
    document.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
            event.preventDefault();
            toggleSearch();
        }
        if (event.key === 'Escape') {
            searchOverlay.classList.add('hidden');
            desktopContext.classList.add('hidden');
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
            event.preventDefault();
            lockSystem();
        }
    });
    document.getElementById('lock-profile-aster').addEventListener('click', () => unlockSystem('Aster'));
    document.getElementById('lock-profile-orion').addEventListener('click', () => unlockSystem('Orion'));
    document.getElementById('lock-profile-luna').addEventListener('click', () => unlockSystem('Luna'));
    document.getElementById('save-file-btn').addEventListener('click', saveFile);
    playButton.addEventListener('click', playMusic);
    document.getElementById('prev-button').addEventListener('click', previousTrack);
    document.getElementById('next-button').addEventListener('click', nextTrack);
    searchInput.addEventListener('input', updateSearch);
    window.addEventListener('resize', () => {
        windowElements.forEach(app => {
            if (app.classList.contains('maximized')) {
                app.style.width = `calc(100vw - 40px)`;
                app.style.height = `calc(100vh - 40px)`;
            }
        });
    });
}
function startBootSequence() {
    welcomeScreen.classList.add('hidden');
    bootScreen.classList.remove('hidden');
    setTimeout(() => {
        bootScreen.classList.add('hidden');
        unlockSystem(state.activeProfile);
    }, 2800);
}
function createInitialStructure() {
    paintCurrentDate();
    updateSearch();
}
function paintCurrentDate() {
    const dateDisplay = document.getElementById('date-display');
    if (!dateDisplay) return;
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}
window.addEventListener('DOMContentLoaded', () => {
    initEventBindings();
    createInitialStructure();
    document.querySelectorAll('.floating-panel').forEach(panel => panel.classList.remove('hidden'));
});
