"use client"

import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface TemplateSelectorProps {
  selectedTemplate: string
  onSelectTemplate: (template: string) => void
}

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean and minimalist design with a focus on content.",
      image: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional design suitable for business presentations.",
      image: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold and colorful design for creative presentations.",
      image: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "academic",
      name: "Academic",
      description: "Formal design suitable for academic presentations.",
      image: "/placeholder.svg?height=120&width=200",
    },
  ]

  return (
    <RadioGroup
      value={selectedTemplate}
      onValueChange={onSelectTemplate}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {templates.map((template) => (
        <div key={template.id} className="relative">
          <RadioGroupItem value={template.id} id={template.id} className="sr-only" />
          <Label htmlFor={template.id} className="cursor-pointer">
            <Card
              className={`overflow-hidden transition-all ${
                selectedTemplate === template.id
                  ? "ring-2 ring-slate-900 dark:ring-slate-100"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="aspect-video relative">
                <Image src={template.image || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-slate-900 dark:text-white">{template.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{template.description}</p>
              </div>
            </Card>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
