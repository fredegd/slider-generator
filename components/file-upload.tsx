"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Loader2 } from "lucide-react"
import TemplateSelector from "@/components/template-selector"
import SlidePreview from "@/components/slide-preview"
import { useToast } from "@/components/ui/use-toast"
import { processFileContent } from "@/lib/process-file"
import { extractTextFromPDF } from "@/lib/pdf-parser"
import TemplateCustomizer from "@/components/template-customizer"
import { useRouter } from "next/navigation"
import { savePresentation } from "@/lib/presentations"
import { useSession } from "next-auth/react"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern")
  const [isProcessing, setIsProcessing] = useState(false)
  const [slides, setSlides] = useState<any[]>([])
  const [customStyles, setCustomStyles] = useState<any>(null)
  const [presentationTitle, setPresentationTitle] = useState<string>("")
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setPresentationTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))

    // Read file content
    try {
      if (selectedFile.type === "application/pdf") {
        const arrayBuffer = await selectedFile.arrayBuffer()
        const extractedText = await extractTextFromPDF(arrayBuffer)
        setFileContent(extractedText)
      } else {
        const text = await selectedFile.text()
        setFileContent(text)
      }

      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been uploaded successfully.`,
      })
    } catch (error) {
      console.error("Error reading file:", error)
      toast({
        title: "Error reading file",
        description: "Failed to read the file content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
  }

  const handleStylesChange = (styles: any) => {
    setCustomStyles(styles)
  }

  const handleGenerateSlides = async () => {
    if (!file || !fileContent) {
      toast({
        title: "No file selected",
        description: "Please upload a file first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const processedContent = await processFileContent(fileContent, file.type, selectedTemplate)
      setSlides(processedContent)

      toast({
        title: "Slides generated",
        description: "Your slides have been generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate slides. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSavePresentation = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your presentation.",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    if (!slides.length) {
      toast({
        title: "No slides to save",
        description: "Please generate slides first.",
        variant: "destructive",
      })
      return
    }

    try {
      await savePresentation({
        title: presentationTitle || "Untitled Presentation",
        template: selectedTemplate,
        customStyles: customStyles || {},
        slides,
        userId: session.user.id,
      })

      toast({
        title: "Presentation saved",
        description: "Your presentation has been saved successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save presentation. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Upload Your File</h2>
          <p className="text-slate-600 dark:text-slate-300">Upload a text or PDF file to generate slides.</p>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" accept=".txt,.pdf" onChange={handleFileChange} className="cursor-pointer" />
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <FileText size={16} />
              <span>{file.name}</span>
            </div>
          )}

          {file && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="title">Presentation Title</Label>
              <Input
                id="title"
                value={presentationTitle}
                onChange={(e) => setPresentationTitle(e.target.value)}
                placeholder="Enter presentation title"
              />
            </div>
          )}
        </div>
      </Card>

      {file && (
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Choose a Template</h2>
              <p className="text-slate-600 dark:text-slate-300">Select a styling template for your slides.</p>

              <TemplateSelector selectedTemplate={selectedTemplate} onSelectTemplate={handleTemplateSelect} />

              <TemplateCustomizer template={selectedTemplate} onStylesChange={handleStylesChange} />

              <div className="flex flex-wrap gap-4">
                <Button onClick={handleGenerateSlides} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Generate Slides
                    </>
                  )}
                </Button>

                {slides.length > 0 && session && (
                  <Button variant="outline" onClick={handleSavePresentation}>
                    Save Presentation
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </>
      )}

      {slides.length > 0 && <SlidePreview slides={slides} template={selectedTemplate} customStyles={customStyles} />}
    </div>
  )
}
