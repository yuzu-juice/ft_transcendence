// @ts-nocheck
// TypeScriptの実装がWebMCPに非対応であるために多量のエラーが発生するのを抑制している

import { useEffect } from 'react'
import { registerWebMcpTools } from '@/lib/webmcp'

export function WebMcpProvider() {
  useEffect(() => {
    // ブラウザがwebmcpに非対応であれば終了する
    if (!document.modelContext) return

    // AbortSignalは非同期操作（APIのfetchなど）とやりとりし
    // 必要に応じてAbortContorollerを介して中止することを可能にする
    const controller = new AbortController()

    // 各toolを登録する
    void registerWebMcpTools(controller.signal).catch()

    // コンポーネントがunmountされるときのクリーンアップ関数
    // 登録したtoolをunregisterし、実行中のハンドラをキャンセルする
    return () => {
      controller.abort()
    }
  }, [])

  return null
}
