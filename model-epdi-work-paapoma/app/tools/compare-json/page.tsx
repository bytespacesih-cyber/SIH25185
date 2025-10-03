"use client"

import type React from "react"
import { useState } from "react"
import { postFormData } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSONViewer } from "@/components/json-viewer"
import { useDocuments } from "@/components/document-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CompareJsonPage() {
  const { similarityFiles } = useDocuments()
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [result, setResult] = useState<any>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [sel1, setSel1] = useState<string>("")
  const [sel2, setSel2] = useState<string>("")

  function resolveSelected(idx: string): File | null {
    const i = Number(idx)
    if (Number.isNaN(i)) return null
    return similarityFiles[i] || null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setResult(undefined)

    const chosen1 = sel1 ? resolveSelected(sel1) : file1
    const chosen2 = sel2 ? resolveSelected(sel2) : file2

    if (!chosen1 || !chosen2) {
      setError("Please select both JSON files (from stored list or upload manually).")
      return
    }

    const fd = new FormData()
    fd.append("file1", chosen1)
    fd.append("file2", chosen2)
    setLoading(true)
    const { data, error } = await postFormData("/compare-json", fd)
    setLoading(false)
    if (error) setError(error)
    else setResult(data)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Similarity: Compare JSON Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {similarityFiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pick Stored JSON 1</Label>
                <Select value={sel1} onValueChange={setSel1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select from stored list" />
                  </SelectTrigger>
                  <SelectContent>
                    {similarityFiles.map((f, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pick Stored JSON 2</Label>
                <Select value={sel2} onValueChange={setSel2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select from stored list" />
                  </SelectTrigger>
                  <SelectContent>
                    {similarityFiles.map((f, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="f1">Or Upload JSON 1</Label>
              <Input
                id="f1"
                type="file"
                accept=".json,application/json"
                onChange={(e) => setFile1(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f2">Or Upload JSON 2</Label>
              <Input
                id="f2"
                type="file"
                accept=".json,application/json"
                onChange={(e) => setFile2(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Comparing..." : "Compare"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && <JSONViewer data={result} />}
        </CardContent>
      </Card>
    </main>
  )
}
