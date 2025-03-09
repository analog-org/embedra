import React from "react"
import { Card } from "./ui/card"

interface EmbedPreviewProps {
  embed: any
}

export function EmbedPreview({ embed }: EmbedPreviewProps) {
  const getColorStyle = () => {
    if (!embed.color) return {}
    const hexColor = `#${embed.color.toString(16).padStart(6, '0')}`
    return { borderLeftColor: hexColor }
  }

  return (
    <Card className="max-w-md border-l-4 bg-gray-800 text-white p-4" style={getColorStyle()}>
      {embed.author && (
        <div className="flex items-center gap-2 mb-2">
          {embed.author.icon_url && (
            <img src={embed.author.icon_url} alt="" className="w-6 h-6 rounded-full" />
          )}
          <div className="text-sm font-medium">
            {embed.author.url ? (
              <a href={embed.author.url} className="hover:underline">{embed.author.name}</a>
            ) : (
              embed.author.name
            )}
          </div>
        </div>
      )}
      
      {embed.title && (
        <div className="font-bold mb-1">
          {embed.url ? (
            <a href={embed.url} className="text-blue-400 hover:underline">{embed.title}</a>
          ) : (
            embed.title
          )}
        </div>
      )}
      
      {embed.description && (
        <div className="text-sm mb-3 whitespace-pre-wrap">{embed.description}</div>
      )}
      
      {embed.fields && embed.fields.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {embed.fields.map((field: any, index: number) => (
            <div key={index} className={`${field.inline ? "col-span-1" : "col-span-3"}`}>
              <div className="font-bold text-xs">{field.name}</div>
              <div className="text-xs">{field.value}</div>
            </div>
          ))}
        </div>
      )}
      
      {embed.image && (
        <div className="mb-3">
          <img src={embed.image.url} alt="" className="max-w-full rounded" />
        </div>
      )}
      
      {embed.thumbnail && (
        <div className="float-right ml-4 mb-2">
          <img src={embed.thumbnail.url} alt="" className="w-16 h-16 rounded" />
        </div>
      )}
      
      {(embed.footer || embed.timestamp) && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
          {embed.footer?.icon_url && (
            <img src={embed.footer.icon_url} alt="" className="w-4 h-4 rounded-full" />
          )}
          {embed.footer?.text && <span>{embed.footer.text}</span>}
          {embed.footer?.text && embed.timestamp && <span>•</span>}
          {embed.timestamp && (
            <span>{new Date(embed.timestamp).toLocaleString()}</span>
          )}
        </div>
      )}
    </Card>
  )
}