import type { ExtensionContext, Tab } from 'vscode'
import { TabInputText, window } from 'vscode'
import { config } from './config'
import { debounce, logger } from './utils'

export class IdleDetector {
  private ctx: ExtensionContext
  private timers: Map<string, NodeJS.Timeout> = new Map()
  private pendingTabs: Set<Tab> = new Set()
  private debouncedProcessTabs: () => void

  constructor(ctx: ExtensionContext) {
    this.ctx = ctx
    this.debouncedProcessTabs = debounce(() => {
      this.processPendingTabs()
    }, 100)
  }

  start() {
    this.initTimers()

    this.ctx.subscriptions.push(
      window.tabGroups.onDidChangeTabs(async (tabs) => {
        for (const tab of tabs.changed) {
          this.pendingTabs.add(tab)
        }
        this.debouncedProcessTabs()
      }),
    )
  }

  private processPendingTabs() {
    const tabsToProcess = Array.from(this.pendingTabs)
    this.pendingTabs.clear()

    for (const tab of tabsToProcess) {
      this.scheduleTabClose(tab)
    }
  }

  dispose() {
    for (const [_, timer] of this.timers) {
      clearTimeout(timer)
    }
    this.timers.clear()
    this.pendingTabs.clear()
  }

  resetTimers() {
    const flatTabs = window.tabGroups.all.flatMap(group => group.tabs)
    for (const tab of flatTabs) {
      this.scheduleTabClose(tab)
    }
  }

  private initTimers() {
    const flatTabs = window.tabGroups.all.flatMap(group => group.tabs)
    for (const tab of flatTabs) {
      this.scheduleTabClose(tab)
    }
  }

  private scheduleTabClose(tab: Tab) {
    if (!this.validateProcessed(tab))
      return false

    const key = (tab.input as TabInputText).uri.toString()
    if (!key)
      return false

    const timer = this.timers.get(key)
    if (timer) {
      clearTimeout(timer)
    }

    this.timers.set(key, setTimeout(
      () => this.closeTab(tab),
      config.idleTimeout * 1000,
    ))

    return true
  }

  private closeTab(_tab: Tab) {
    const tab = this.findCurrentTab(_tab)
    if (!tab || tab.isDirty || tab.isActive || tab.isPinned)
      return

    const key = (tab.input as TabInputText).uri.toString()
    if (!key)
      return

    window.tabGroups.close(tab)
      .then((success) => {
        if (success) {
          logger.info(`successfully closed tab ${tab.label}`)
          this.timers.delete(key)
        }
        else {
          logger.error(`error closing tab ${tab.label}`)
        }
      })
  }

  private findCurrentTab(targetTab: Tab): Tab | undefined {
    const flatTabs = window.tabGroups.all.flatMap(group => group.tabs)
    return flatTabs.find(tab =>
      tab.input instanceof TabInputText
      && targetTab.input instanceof TabInputText
      && tab.input.uri.toString() === targetTab.input.uri.toString(),
    )
  }

  private validateProcessed(tab: Tab) {
    if (config.idleTimeout === 0)
      return false

    if (tab.isDirty || !(tab.input instanceof TabInputText))
      return false

    const filePath = tab.input.uri.path
    const fileName = filePath.split('/').pop() || ''

    const exclude = config.idleExclusions ?? []
    for (const pattern of exclude) {
      if (this.matchPattern(fileName, pattern)) {
        return false
      }
    }

    return true
  }

  private matchPattern(fileName: string, pattern: string) {
    try {
      const escapedPattern = pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.')

      const regex = new RegExp(`^${escapedPattern}$`)
      return regex.test(fileName)
    }
    catch (error) {
      logger.error(`invalid pattern: ${pattern}`, error)
      return false
    }
  }
}
