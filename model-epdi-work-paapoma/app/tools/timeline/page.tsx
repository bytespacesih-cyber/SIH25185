"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RDPaperTool } from "../_components/file-upload"
import { JSONViewer } from "@/components/json-viewer"

export default function TimelinePage() {
  // Show a parsed view if backend returns "timeline_json" string
  const [raw, setRaw] = useState<any>(null)

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Timeline Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* We reuse RDPaperTool and also intercept the JSON viewer via label */}
          <RDPaperTool endpoint="/timeline" />
          {/* Optional note */}
          <p className="text-sm text-muted-foreground">
            The response will be displayed as JSON, including any timeline data returned by the backend.
          </p>
          {raw && <JSONViewer data={raw} label="Timeline JSON" />}
        </CardContent>
      </Card>
    </main>
  )
}
