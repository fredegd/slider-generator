"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserPresentations, deletePresentation } from "@/lib/presentations"
import { Loader2, FileText, Trash2, Edit, Download } from "lucide-react"
import { generatePDF } from "@/lib/generate-pdf"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [presentations, setPresentations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchPresentations()
    }
  }, [status, session, router])

  const fetchPresentations = async () => {
    if (!session?.user?.id) return

    try {
      const userPresentations = await getUserPresentations(session.user.id)
      setPresentations(userPresentations)
    } catch (error) {
      console.error("Error fetching presentations:", error)
      toast({
        title: "Error",
        description: "Failed to load your presentations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePresentation(id)
      setPresentations(presentations.filter((p) => p.id !== id))
      toast({
        title: "Presentation deleted",
        description: "Your presentation has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete presentation",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (presentation: any) => {
    try {
      toast({
        title: "Generating PDF",
        description: "Your presentation is being prepared for download...",
      })

      await generatePDF(presentation.slides, presentation.template, presentation.customStyles)

      toast({
        title: "Download complete",
        description: "Your presentation has been downloaded as a PDF",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to generate PDF",
        variant: "destructive",
      })
    }
  }

  const handleCreateNew = () => {
    router.push("/")
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-300" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-4">
            Your Presentations
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Manage your saved presentations or create a new one
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <Button onClick={handleCreateNew} size="lg">
            Create New Presentation
          </Button>
        </div>

        {presentations.length === 0 ? (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>No presentations yet</CardTitle>
              <CardDescription>
                You haven't created any presentations yet. Click the button above to get started.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation) => (
              <Card key={presentation.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="truncate">{presentation.title}</CardTitle>
                  <CardDescription>Created: {new Date(presentation.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-2">
                    <FileText size={16} />
                    <span>Template: {presentation.template}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{presentation.slides.length} slides</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(presentation.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(presentation)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(presentation.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
