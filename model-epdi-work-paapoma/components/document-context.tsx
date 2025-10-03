"use client"

import type React from "react"
import { createContext, useContext, useMemo, useState } from "react"
import { postFormData } from "@/lib/api"

type DocContext = {
  // R&D Paper shared across tools
  rdPaper: File | null
  setRDPaper: (f: File | null) => void

  // Guidelines PDF and backend key
  guidelinesPdf: File | null
  setGuidelinesPdf: (f: File | null) => void
  guidelinesKey: string | null
  setGuidelinesKey: (k: string | null) => void
  guidelinesUploaded: boolean
  uploadGuidelines: () => Promise<{ ok: boolean; error?: string }>

  // Similarity files (up to 5 JSON files)
  similarityFiles: File[]
  addSimilarityFiles: (files: File[]) => void
  clearSimilarityFiles: () => void
}

const DocumentCtx = createContext<DocContext | undefined>(undefined)

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [rdPaper, setRDPaper] = useState<File | null>(null)
  const [guidelinesPdf, setGuidelinesPdf] = useState<File | null>(null)
  const [guidelinesKey, setGuidelinesKey] = useState<string | null>(null)
  const [guidelinesUploaded, setGuidelinesUploaded] = useState(false)
  const [similarityFiles, setSimilarityFiles] = useState<File[]>([])

  async function uploadGuidelines() {
    if (!guidelinesPdf) return { ok: false, error: "No guidelines PDF selected" }
    const fd = new FormData()
    fd.append("file", guidelinesPdf)
    const { error } = await postFormData("/upload-guidelines", fd)
    if (error) return { ok: false, error }
    // Backend indexes using original filename as key
    setGuidelinesKey(guidelinesPdf.name)
    setGuidelinesUploaded(true)
    return { ok: true }
  }

  const addSimilarityFiles = (files: File[]) => {
    // keep only first 5 files total
    setSimilarityFiles((prev) => {
      const merged = [...prev, ...files]
      return merged.slice(0, 5)
    })
  }

  const clearSimilarityFiles = () => setSimilarityFiles([])

  const value = useMemo(
    () => ({
      rdPaper,
      setRDPaper,
      guidelinesPdf,
      setGuidelinesPdf,
      guidelinesKey,
      setGuidelinesKey,
      guidelinesUploaded,
      uploadGuidelines,
      similarityFiles,
      addSimilarityFiles,
      clearSimilarityFiles,
    }),
    [rdPaper, guidelinesPdf, guidelinesKey, guidelinesUploaded, similarityFiles],
  )

  return <DocumentCtx.Provider value={value}>{children}</DocumentCtx.Provider>
}

export function useDocuments() {
  const ctx = useContext(DocumentCtx)
  if (!ctx) throw new Error("useDocuments must be used within DocumentProvider")
  return ctx
}
