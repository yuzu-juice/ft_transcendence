// @ts-nocheck

import { registerAccountTools } from './account'
import { registerTaskTools } from './task'

export async function registerWebMcpTools(signal: AbortSignal) {
  if (!document.modelContext) return

  await Promise.all([registerTaskTools(signal), registerAccountTools(signal)])
}
