# VSCode Zen Tabs

<a href="https://marketplace.visualstudio.com/items?itemName=octohash.zen-tabs" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/octohash.zen-tabs.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

A VSCode extension for managing tabs with zen-like focus — clean idle tabs, and choose where new tabs open.

## Features

### 🧹 Idle Tab Management
Automatically closes tabs that have been inactive for a specified period, helping you maintain a clean workspace and focus on what matters.

- **Configurable timeout**: Set how long a tab should be idle before being closed (default: 120 seconds)
- **Smart exclusions**: Exclude specific file patterns from being auto-closed
- **Safe defaults**: Won't close dirty, active, or pinned tabs

### 📍 Tab Positioning
Control where new tabs open and how active tabs are positioned for better workflow organization.

- **Insert at start**: New tabs can be inserted at the beginning of the tab list
- **Tab promotion**: Active tabs can be moved to the front when you edit or save them
- **Pinned tab respect**: Always respects pinned tabs and positions new tabs after them

### ⌨️ Keyboard Shortcuts
- **Bury Active Tab**: `Ctrl+Alt+Right` (Windows/Linux) or `Cmd+Alt+Right` (Mac) - Only available when "Insert at start" is enabled. This command moves the active tab to the end and switches to the next tab, preventing you from getting stuck in a loop when the active tab is at the beginning. This overrides VSCode's default tab switching behavior, so you don't need to remember separate shortcuts for the extension.

## Configuration

<!-- configs -->

| Key                             | Description                                                         | Type      | Default           |
| ------------------------------- | ------------------------------------------------------------------- | --------- | ----------------- |
| `zen-tabs.idleTimeout`          | The idle timeout in seconds.                                        | `number`  | `120`             |
| `zen-tabs.idleExclusions`       | The list of file patterns to exclude from idle timeout.             | `array`   | `[]`              |
| `zen-tabs.insertTabAtStart`     | Whether to insert new tabs at the start of the tab list.            | `boolean` | `true`            |
| `zen-tabs.tabPromotionTriggers` | The list of events to detect move tab to the start of the tab list. | `array`   | `["edit","save"]` |

<!-- configs -->

## Commands

<!-- commands -->

| Command                           | Title                     |
| --------------------------------- | ------------------------- |
| `octohash.zen-tabs.buryActiveTab` | Zen Tabs: Bury Active Tab |

<!-- commands -->

## License

[MIT](./LICENSE) License © [jinghaihan](https://github.com/jinghaihan)
