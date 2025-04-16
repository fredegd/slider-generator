import { Suspense } from "react"
import FileUpload from "@/components/file-upload"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-4">
            Slide Generator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Upload a text or PDF file, choose a template, and generate beautiful slides with AI.
          </p>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <FileUpload />
        </Suspense>
      </div>
      <Toaster />
    </main>
  )
}
