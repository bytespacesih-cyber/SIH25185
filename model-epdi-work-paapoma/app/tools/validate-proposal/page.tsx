"use client"

import { useState } from "react"
import { postJson } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { JSONViewer } from "@/components/json-viewer"

type Issue = { line: number; message: string }
type ValidationResponse = { issues: Issue[] }

export default function ValidateProposalPage() {
  const [content, setContent] = useState("")
  const [result, setResult] = useState<ValidationResponse | null>(null)
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function onValidate() {
    setError(undefined)
    setResult(null)
    if (!content.trim()) {
      setError("Please paste the proposal content.")
      return
    }
    setLoading(true)
    const { data, error } = await postJson<ValidationResponse, { content: string }>("/validateProposal", { content })
    setLoading(false)
    if (error) setError(error)
    else setResult(data || null)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Validate Proposal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Proposal Content</Label>
            <Textarea
              id="content"
              className="min-h-64"
              placeholder="Paste your multi-line proposal content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button onClick={onValidate} disabled={loading}>
            {loading ? "Validating..." : "Validate"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && <JSONViewer data={result} label="Issues" />}
        </CardContent>
      </Card>
    </main>
  )
}
