import { Button } from 'otsukimi-ui'
import { useEffect, useId, useRef, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onOpenChange: (open: boolean) => void
  showCloseButton?: boolean // 閉じるボタンを表示するか
  dismissible?: boolean // Escapeや背景クリックによる閉じる操作を許可するか
}

export const Modal = ({
  open,
  title,
  children,
  onOpenChange,
  showCloseButton = true,
  dismissible = true,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-auto max-h-[75vh] w-[75vw] max-w-2xl overflow-hidden rounded-xl bg-white p-0 shadow-xl backdrop:bg-black/40"
      onCancel={(event) => {
        event.preventDefault()
        if (dismissible) {
          onOpenChange(false)
        }
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && dismissible) {
          onOpenChange(false)
        }
      }}
      onClose={() => {
        if (open) {
          onOpenChange(false)
        }
      }}
    >
      <div className="flex max-h-[75vh] flex-col">
        <header className="flex shrink-0 items-center justify-between px-5 py-3">
          <h2 id={titleId} className="text-lg font-heading font-bold">
            {title}
          </h2>
          {showCloseButton && (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false)
              }}
              variant="transparent"
              className="rounded-md !min-w-fit p-2 hover:bg-black/5"
            >
              ×
            </Button>
          )}
        </header>
        <div className="min-h-0 overflow-y-auto p-5">{children}</div>
      </div>
    </dialog>
  )
}
