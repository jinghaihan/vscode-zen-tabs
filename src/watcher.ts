import type { ConfigurationChangeEvent, ExtensionContext } from 'vscode'
import type { ConfigurationChangeCallback } from './types'
import { workspace } from 'vscode'
import { debounce, logger } from './utils'

export class ConfigWatcher {
  private ctx: ExtensionContext
  private configChangeCallbacks: ConfigurationChangeCallback[]
  private debouncedConfigChange: (e: ConfigurationChangeEvent) => void

  constructor(ctx: ExtensionContext, configChangeCallbacks: ConfigurationChangeCallback[] = []) {
    this.ctx = ctx
    this.configChangeCallbacks = configChangeCallbacks
    this.debouncedConfigChange = debounce((e: ConfigurationChangeEvent) => {
      this.configChangeCallbacks.forEach(callback => callback(e))
    }, 500)
  }

  start() {
    const configChangeDisposable = workspace.onDidChangeConfiguration((e) => {
      this.debouncedConfigChange(e)
    })
    this.ctx.subscriptions.push(configChangeDisposable)

    logger.info('Config watcher started')
  }

  dispose() {
    logger.info('Config watcher disposed')
  }
}
