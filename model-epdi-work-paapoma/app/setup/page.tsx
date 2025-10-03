"use client"

import { useState } from "react"
import { useDocuments } from "@/components/document-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SetupPage() {
  const {
    rdPaper,
    setRDPaper,
    guidelinesPdf,
    setGuidelinesPdf,
    guidelinesUploaded,
    uploadGuidelines,
    guidelinesKey,
    similarityFiles,
    addSimilarityFiles,
    clearSimilarityFiles,
  } = useDocuments()

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>()
  const [okMsg, setOkMsg] = useState<string>("")

  async function onIndexGuidelines() {
    setError(undefined)
    setOkMsg("")
    if (!guidelinesPdf) {
      setError("Select a Guidelines PDF first.")
      return
    }
    setUploading(true)
    const { ok, error } = await uploadGuidelines()
    setUploading(false)
    if (!ok && error) setError(error)
    else setOkMsg("Guidelines indexed successfully.")
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: R&amp;D Paper (used across tools)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rd">Upload PDF</Label>
            <Input id="rd" type="file" accept=".pdf" onChange={(e) => setRDPaper(e.target.files?.[0] || null)} />
            {rdPaper && <p className="text-sm text-muted-foreground">Selected: {rdPaper.name}</p>}
          </div>
          <p className="text-sm text-muted-foreground">
            This file will be reused by Plagiarism, Novelty, Cost, Timeline, and Extract JSON.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 2: Guidelines PDF (for RAG Q&amp;A)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gl">Upload Guidelines PDF</Label>
            <Input id="gl" type="file" accept=".pdf" onChange={(e) => setGuidelinesPdf(e.target.files?.[0] || null)} />
            {guidelinesPdf && <p className="text-sm text-muted-foreground">Selected: {guidelinesPdf.name}</p>}
          </div>
          <Button onClick={onIndexGuidelines} disabled={uploading || !guidelinesPdf}>
            {uploading ? "Indexing..." : guidelinesUploaded ? "Re-index" : "Upload & Index"}
          </Button>
          {guidelinesUploaded && <p className="text-sm text-muted-foreground">Indexed as: {guidelinesKey}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {okMsg && <p className="text-sm text-green-600">{okMsg}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Similarity Reference Set (4–5 JSONs)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sim">Add JSON files</Label>
            <Input
              id="sim"
              type="file"
              accept=".json,application/json"
              multiple
              onChange={(e) => addSimilarityFiles(Array.from(e.target.files || []))}
            />
          </div>
          {similarityFiles.length > 0 ? (
            <ul className="text-sm list-disc pl-5 space-y-1">
              {similarityFiles.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No files added yet.</p>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={clearSimilarityFiles} disabled={similarityFiles.length === 0}>
              Clear List
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            You can pick any two of these later on the Similarity (Compare) page.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
