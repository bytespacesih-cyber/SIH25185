"use client"

import { useState } from "react"
import { postFormData } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { JSONViewer } from "@/components/json-viewer"

export default function JsonChatPage() {
  const [file, setFile] = useState<File | null>(null)
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState<any>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function onAsk() {
    setError(undefined)
    setResult(undefined)
    if (!file) {
      setError("Please select a JSON file.")
      return
    }
    if (!question.trim()) {
      setError("Enter a question.")
      return
    }
    const fd = new FormData()
    fd.append("file", file)
    fd.append("question", question)
    setLoading(true)
    const { data, error } = await postFormData("/ask-json", fd)
    setLoading(false)
    if (error) setError(error)
    else setResult(data)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JSON Chat (RAG)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="json">Upload JSON</Label>
            <Input
              id="json"
              type="file"
              accept=".json,application/json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q">Question</Label>
            <Input
              id="q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question based on the uploaded JSON..."
            />
          </div>
          <Button onClick={onAsk} disabled={loading}>
            {loading ? "Asking..." : "Ask"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && <JSONViewer data={result} />}
        </CardContent>
      </Card>
    </main>
  )
}
