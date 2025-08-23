import type { Disposable, ExtensionContext, TabGroup } from 'vscode'
import { commands, window, workspace } from 'vscode'
import { config } from './config'
import { extensionId } from './generated/meta'
import { logger } from './utils'

export class TabPromoter {
  private ctx: ExtensionContext
  private disposables: Disposable[] = []

  constructor(ctx: ExtensionContext) {
    this.ctx = ctx
  }

  start() {
    this.registerListenerEvents()
  }

  dispose() {
    this.cleanupDisposables()
  }

  private cleanupDisposables() {
    if (this.disposables.length) {
      this.disposables.forEach(disposable => disposable.dispose())
      this.disposables = []
    }
  }

  registerListenerEvents() {
    this.cleanupDisposables()

    const events = config.tabPromotionTriggers

    logger.info('Insert tab at start', config.insertTabAtStart)
    logger.info('Registering listener events', events.join(', '))

    if (config.insertTabAtStart) {
      this.disposables.push(window.onDidChangeActiveTextEditor(() => this.moveTab()))
    }
    else {
      this.disposables = events.map((event) => {
        let disposable: Disposable
        switch (event) {
          case 'edit':
            disposable = workspace.onDidChangeTextDocument(() => this.moveTab())
            break
          case 'save':
            disposable = workspace.onWillSaveTextDocument(() => this.moveTab())
            break
        }
        return disposable
      })
    }

    this.ctx.subscriptions.push(...this.disposables)
    // Update the context for the keybinding to be available
    commands.executeCommand('setContext', `${extensionId}.insertTabAtStart`, config.insertTabAtStart)
  }

  private moveTab() {
    const { activeGroup, activeTab } = this.getActiveState() ?? {}
    if (!activeGroup || !activeTab)
      return

    const offset = this.getPositionAfterLastPinnedTab(activeGroup)
    commands.executeCommand('moveActiveEditor', {
      to: 'position',
      value: offset + 1,
    })
  }

  private getActiveState() {
    const activeGroup = window.tabGroups.all.filter(
      group => group.isActive,
    )[0]
    if (!activeGroup)
      return

    const activeTab = activeGroup.activeTab
    if (activeTab?.isPinned)
      return

    return { activeGroup, activeTab }
  }

  private getPositionAfterLastPinnedTab(activeGroup: TabGroup): number {
    let lastPinnedIndex = -1
    for (let i = 0; i < activeGroup.tabs.length; i++) {
      const tab = activeGroup.tabs[i]
      if (tab.isPinned) {
        lastPinnedIndex = i
      }
      else {
        break
      }
    }

    return lastPinnedIndex + 1
  }
}
