"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function JSONViewer({
  data,
  className,
  label = "Result",
}: {
  data: any
  className?: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)
  const pretty =
    typeof data === "string"
      ? (() => {
          try {
            return JSON.stringify(JSON.parse(data), null, 2)
          } catch {
            return data
          }
        })()
      : JSON.stringify(data, null, 2)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{label}</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(pretty)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="whitespace-pre-wrap text-sm bg-secondary p-4 rounded-md overflow-auto">{pretty}</pre>
    </div>
  )
}
