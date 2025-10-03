"use client"

import type React from "react"
import { useDocuments } from "@/components/document-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { JSONViewer } from "@/components/json-viewer"
import Link from "next/link"
import { postFormData } from "@/lib/api"

export function SingleFileTool({
  endpoint,
  accept = ".pdf",
  title,
  buttonText = "Submit",
}: {
  endpoint: string
  accept?: string
  title: string
  buttonText?: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setResult(undefined)
    if (!file) {
      setError("Please select a file.")
      return
    }
    const fd = new FormData()
    fd.append("file", file)
    setLoading(true)
    const { data, error } = await postFormData(endpoint, fd)
    setLoading(false)
    if (error) setError(error)
    else setResult(data)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">{title}</Label>
        <Input id="file" type="file" accept={accept} onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Processing..." : buttonText}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {result && <JSONViewer data={result} />}
    </form>
  )
}

export function RDPaperTool({
  endpoint,
  title = "Use shared R&D Paper",
  buttonText = "Submit",
}: {
  endpoint: string
  title?: string
  buttonText?: string
}) {
  const { rdPaper } = useDocuments()
  const [result, setResult] = useState<any>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [fallback, setFallback] = useState<File | null>(null)

  async function submitWith(file: File) {
    const fd = new FormData()
    fd.append("file", file)
    setLoading(true)
    const { data, error } = await postFormData(endpoint, fd)
    setLoading(false)
    if (error) setError(error)
    else setResult(data)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setResult(undefined)
    if (rdPaper) {
      await submitWith(rdPaper)
    } else if (fallback) {
      await submitWith(fallback)
    } else {
      setError("Please add an R&D Paper in Setup or upload a file below.")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>{title}</Label>
        {rdPaper ? (
          <p className="text-sm text-muted-foreground">Using: {rdPaper.name}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No shared R&amp;D Paper found. Go to{" "}
            <Link className="underline underline-offset-4" href="/setup">
              Setup
            </Link>{" "}
            or upload a file below.
          </p>
        )}
      </div>

      {!rdPaper && (
        <div className="space-y-2">
          <Label htmlFor="fallback">Upload PDF (fallback)</Label>
          <Input id="fallback" type="file" accept=".pdf" onChange={(e) => setFallback(e.target.files?.[0] || null)} />
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Processing..." : buttonText}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && <JSONViewer data={result} />}
    </form>
  )
}
