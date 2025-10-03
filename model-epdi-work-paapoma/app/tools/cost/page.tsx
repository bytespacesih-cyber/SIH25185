import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SingleFileTool, RDPaperTool } from "../_components/file-upload"

export default function CostPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Estimation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SingleFileTool endpoint="/check-cost" title="Upload PDF" />
          <RDPaperTool endpoint="/check-cost" />
        </CardContent>
      </Card>
    </main>
  )
}
