# VSCode Zen Tabs

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

### Idle Tab Settings

```json
{
  "zen-tabs.idleTimeout": 120, // Idle timeout in seconds (0 to disable)
  "zen-tabs.idleExclusions": [ // File patterns to exclude from auto-close
    "package.json",
    "*.config.js",
    "*.md"
  ]
}
```

### Tab Positioning Settings

```json
{
  "zen-tabs.insertTabAtStart": true, // Insert new tabs at the start
  "zen-tabs.tabPromotionTriggers": [ // Events that trigger tab promotion
    "edit", // When you edit a file
    "save" // When you save a file
  ]
}
```

## Alternative: VSCode Built-in Tab Limit

If you need tab limit functionality, you can use VSCode's built-in tab limit configuration:

```json
{
  "workbench.editor.limit.enabled": true,
  "workbench.editor.limit.perEditorGroup": true,
  "workbench.editor.limit.value": 5
}
```

This will automatically close the least recently used tabs when you exceed the limit, providing a simpler approach to tab management.

## Installation

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Zen Tabs"
4. Click Install

## License

[MIT](./LICENSE) License © [jinghaihan](https://github.com/jinghaihan)
