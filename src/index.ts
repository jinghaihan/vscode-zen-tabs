import type { ExtensionContext } from 'vscode'
import { defineExtension } from 'reactive-vscode'
import { commands } from 'vscode'
import { IdleDetector } from './idle'
import { TabPromoter } from './tab'
import { ConfigWatcher } from './watcher'

const { activate, deactivate } = defineExtension(async (ctx: ExtensionContext) => {
  const idleDetector = new IdleDetector(ctx)
  idleDetector.start()

  const tabPromoter = new TabPromoter(ctx)
  tabPromoter.start()

  const configWatcher = new ConfigWatcher(ctx, [
    () => idleDetector.resetTimers(),
    () => tabPromoter.registerListenerEvents(),
  ])
  configWatcher.start()

  ctx.subscriptions.push(
    commands.registerCommand('octohash.zen-tabs.buryActiveTab', () => {
      commands.executeCommand('moveActiveEditor', { to: 'last' })
      commands.executeCommand('workbench.action.nextEditorInGroup')
    }),
  )

  ctx.subscriptions.push({
    dispose: () => {
      idleDetector.dispose()
      tabPromoter.dispose()
      configWatcher.dispose()
    },
  })
})

export { activate, deactivate }
