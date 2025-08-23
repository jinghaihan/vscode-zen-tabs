import type { ConfigurationChangeEvent } from 'vscode'

export type ConfigurationChangeCallback = (e: ConfigurationChangeEvent) => void
