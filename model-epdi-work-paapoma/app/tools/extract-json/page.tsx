import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RDPaperTool } from "../_components/file-upload"

export default function ExtractJsonPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Extract Structured JSON</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RDPaperTool endpoint="/extract-json" />
        </CardContent>
      </Card>
    </main>
  )
}
