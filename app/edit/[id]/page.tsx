"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getPresentation, updatePresentation } from "@/lib/presentations"
import TemplateSelector from "@/components/template-selector"
import TemplateCustomizer from "@/components/template-customizer"
import SlidePreview from "@/components/slide-preview"

export default function EditPresentation() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [presentation, setPresentation] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [template, setTemplate] = useState("modern")
  const [customStyles, setCustomStyles] = useState<any>(null)
  const [slides, setSlides] = useState<any[]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }

    if (status === "authenticated" && params.id) {
      fetchPresentation(params.id as string)
    }
  }, [status, params.id, router])

  const fetchPresentation = async (id: string) => {
    try {
      const data = await getPresentation(id)

      if (!data) {
        toast({
          title: "Presentation not found",
          description: "The requested presentation could not be found",
          variant: "destructive",
        })
        router.push("/dashboard")
        return
      }

      // Check if user owns this presentation
      if (data.userId !== session?.user?.id) {
        toast({
          title: "Access denied",
          description: "You don't have permission to edit this presentation",
          variant: "destructive",
        })
        router.push("/dashboard")
        return
      }

      setPresentation(data)
      setTitle(data.title)
      setTemplate(data.template)
      setCustomStyles(data.customStyles || null)
      setSlides(data.slides as any[])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load presentation",
        variant: "destructive",
      })
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (newTemplate: string) => {
    setTemplate(newTemplate)
  }

  const handleStylesChange = (styles: any) => {
    setCustomStyles(styles)
  }

  const handleSave = async () => {
    if (!presentation?.id) return

    setIsSaving(true)

    try {
      await updatePresentation(presentation.id, {
        title,
        template,
        customStyles,
        slides,
      })

      toast({
        title: "Changes saved",
        description: "Your presentation has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-300" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Presentation</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Presentation Details</h2>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter presentation title"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Template Settings</h2>
              <p className="text-slate-600 dark:text-slate-300">Choose a template and customize its appearance.</p>

              <TemplateSelector selectedTemplate={template} onSelectTemplate={handleTemplateSelect} />

              <TemplateCustomizer template={template} onStylesChange={handleStylesChange} />
            </div>
          </Card>

          {slides.length > 0 && <SlidePreview slides={slides} template={template} customStyles={customStyles} />}
        </div>
      </div>
    </div>
  )
}
