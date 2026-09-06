// @ts-nocheck

import { useEffect } from 'react'
import { registerWebMcpTools } from '@/lib/webmcp'

export function WebMcpProvider() {
  useEffect(() => {
    if (!document.modelContext) return

    const controller = new AbortController()

    void registerWebMcpTools(controller.signal).catch()

    return () => {
      controller.abort()
    }
  }, [])

  return null
}
