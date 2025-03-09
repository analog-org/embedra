import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { EmbedPreview } from "./EmbedPreview"

interface EmbedPreviewModalProps {
  embed: any
  isOpen: boolean
  onClose: () => void
}

export function EmbedPreviewModal({ embed, isOpen, onClose }: EmbedPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Embed Preview</DialogTitle>
        </DialogHeader>
        <div className="bg-gray-900 p-4 rounded-md">
          <EmbedPreview embed={embed} />
        </div>
      </DialogContent>
    </Dialog>
  )
}