"use client"

import { useState } from "react"
import { postFormData } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { JSONViewer } from "@/components/json-viewer"
import { useDocuments } from "@/components/document-context"

export default function GuidelinesRAGPage() {
  const { guidelinesPdf, setGuidelinesPdf, guidelinesKey, uploadGuidelines, guidelinesUploaded } = useDocuments()
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<any>()
  const [error, setError] = useState<string>()
  const [loadingUp, setLoadingUp] = useState(false)
  const [loadingAsk, setLoadingAsk] = useState(false)

  async function onUpload() {
    setError(undefined)
    setAnswer(undefined)
    if (!guidelinesPdf) {
      setError("Please select a Guidelines PDF.")
      return
    }
    setLoadingUp(true)
    const { ok, error } = await uploadGuidelines()
    setLoadingUp(false)
    if (!ok && error) setError(error)
  }

  async function ask() {
    setError(undefined)
    setAnswer(undefined)
    const key = guidelinesKey || (guidelinesPdf ? guidelinesPdf.name : "")
    if (!key) {
      setError("Upload a guidelines PDF first.")
      return
    }
    if (!question.trim()) {
      setError("Enter a question.")
      return
    }
    const fd = new FormData()
    fd.append("filename", key)
    fd.append("question", question)
    setLoadingAsk(true)
    const { data, error } = await postFormData("/ask-guidelines", fd)
    setLoadingAsk(false)
    if (error) setError(error)
    else setAnswer(data)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guidelines RAG Q&amp;A</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf">Guidelines PDF</Label>
            <Input id="pdf" type="file" accept=".pdf" onChange={(e) => setGuidelinesPdf(e.target.files?.[0] || null)} />
            <Button onClick={onUpload} disabled={loadingUp || !guidelinesPdf}>
              {loadingUp ? "Indexing..." : guidelinesUploaded ? "Re-index" : "Upload & Index"}
            </Button>
            {guidelinesPdf && (
              <p className="text-sm text-muted-foreground">
                Selected: {guidelinesPdf.name} {guidelinesUploaded ? "(indexed)" : ""}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="q">Ask a Question</Label>
            <Input
              id="q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask based on the Guidelines PDF..."
            />
            <Button onClick={ask} disabled={loadingAsk}>
              {loadingAsk ? "Asking..." : "Ask"}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {answer && <JSONViewer data={answer} />}
        </CardContent>
      </Card>
    </main>
  )
}
