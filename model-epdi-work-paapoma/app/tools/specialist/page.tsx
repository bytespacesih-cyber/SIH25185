"use client"

import { useState } from "react"
import { postFormData } from "@/lib/api" // Assuming this helper function exists
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { JSONViewer } from "@/components/json-viewer" // Assuming this component exists

export default function JsonRAGPage() {
  const [jsonFile, setJsonFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<any>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function askJson() {
    // Reset previous state
    setError(undefined)
    setAnswer(undefined)

    // Validate inputs
    if (!jsonFile) {
      setError("Please select a JSON file.")
      return
    }
    if (!question.trim()) {
      setError("Please enter a question.")
      return
    }

    setLoading(true)

    // Create form data and call the API
    const fd = new FormData()
    fd.append("file", jsonFile)
    fd.append("question", question)
    const { data, error } = await postFormData("/ask-json", fd)

    setLoading(false)

    if (error) {
      setError(error)
    } else {
      setAnswer(data)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JSON RAG Q&A</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="json-file">JSON Document</Label>
            <Input id="json-file" type="file" accept=".json" onChange={(e) => setJsonFile(e.target.files?.[0] || null)} />
            {jsonFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {jsonFile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="q">Ask a Question</Label>
            <Input
              id="q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question based on the JSON file..."
            />
          </div>

          <Button onClick={askJson} disabled={loading || !jsonFile || !question.trim()}>
            {loading ? "Asking..." : "Ask"}
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {answer && <JSONViewer data={answer} />}
        </CardContent>
      </Card>
    </main>
  )
}