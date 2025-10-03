import { ToolCard } from "@/components/tool-card"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-balance">NaCCER Proposal Auto‑Evaluation Portal</h1>
        <p className="text-muted-foreground">
          Submit your R&amp;D proposal once, then use the assessment tools below. Designed for clarity, accessibility,
          and compliance with government standards.
        </p>
        <div>
          <Link
            href="/setup"
            className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-md"
          >
            Go to Setup
          </Link>
        </div>
      </header>

      <section id="tools" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ToolCard
          href="/setup"
          title="Initial Setup"
          description="Upload R&D Paper, Guidelines PDF, and add 4–5 reference JSONs for similarity."
        />
        {/* ... existing cards ... */}
        <ToolCard
          href="/tools/plagiarism"
          title="Plagiarism Check"
          description="Run plagiarism on the shared R&D paper."
        />
        <ToolCard
          href="/tools/novelty"
          title="Novelty Report"
          description="Estimate novelty from the shared R&D paper."
        />
        <ToolCard href="/tools/cost" title="Cost Estimation" description="Estimate costs using the shared R&D paper." />
        <ToolCard
          href="/tools/timeline"
          title="Timeline Generator"
          description="Generate a project timeline from the shared R&D paper."
        />
        <ToolCard
          href="/tools/extract-json"
          title="Document → JSON"
          description="Extract structured JSON from the shared R&D paper."
        />
        <ToolCard
          href="/tools/compare-json"
          title="Similarity (Compare)"
          description="Pick 2 of your stored JSON references to compare similarity."
        />
        <ToolCard
          href="/tools/guidelines"
          title="Guidelines RAG QA"
          description="Ask questions based on the uploaded Guidelines PDF."
        />
        <ToolCard
          href="/tools/validate-proposal"
          title="Proposal Validator"
          description="Validate pasted content against template and guidelines."
        />
      </section>
    </main>
  )
}
