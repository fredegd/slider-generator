"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface TemplateCustomizerProps {
  template: string
  onStylesChange: (styles: any) => void
}

export default function TemplateCustomizer({ template, onStylesChange }: TemplateCustomizerProps) {
  const [backgroundColor, setBackgroundColor] = useState<string>("")
  const [textColor, setTextColor] = useState<string>("")
  const [fontFamily, setFontFamily] = useState<string>("default")
  const [fontSize, setFontSize] = useState<number>(18)
  const [enableGradient, setEnableGradient] = useState<boolean>(false)
  const [gradientStart, setGradientStart] = useState<string>("#f06")
  const [gradientEnd, setGradientEnd] = useState<string>("#9f6")

  // Reset customizations when template changes
  useEffect(() => {
    // Set default values based on template
    switch (template) {
      case "modern":
        setBackgroundColor("#ffffff")
        setTextColor("#333333")
        setFontFamily("sans")
        setFontSize(18)
        setEnableGradient(false)
        break
      case "corporate":
        setBackgroundColor("#f5f5f5")
        setTextColor("#003366")
        setFontFamily("serif")
        setFontSize(18)
        setEnableGradient(false)
        break
      case "creative":
        setBackgroundColor("#ffffff")
        setTextColor("#ffffff")
        setFontFamily("sans")
        setFontSize(18)
        setEnableGradient(true)
        setGradientStart("#f06")
        setGradientEnd("#9f6")
        break
      case "academic":
        setBackgroundColor("#ffffff")
        setTextColor("#333333")
        setFontFamily("serif")
        setFontSize(18)
        setEnableGradient(false)
        break
      default:
        setBackgroundColor("#ffffff")
        setTextColor("#333333")
        setFontFamily("sans")
        setFontSize(18)
        setEnableGradient(false)
    }
  }, [template])

  // Update parent component when customizations change
  useEffect(() => {
    const styles = {
      backgroundColor: enableGradient ? undefined : backgroundColor,
      textColor,
      fontFamily: getFontFamilyValue(fontFamily),
      fontSize,
      gradient: enableGradient
        ? {
            start: gradientStart,
            end: gradientEnd,
          }
        : undefined,
    }

    onStylesChange(styles)
  }, [backgroundColor, textColor, fontFamily, fontSize, enableGradient, gradientStart, gradientEnd, onStylesChange])

  const getFontFamilyValue = (fontType: string) => {
    switch (fontType) {
      case "sans":
        return "Arial, Helvetica, sans-serif"
      case "serif":
        return "Georgia, 'Times New Roman', serif"
      case "mono":
        return "'Courier New', monospace"
      default:
        return undefined
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="customization">
        <AccordionTrigger className="text-lg font-medium">Customize Template</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Background options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-gradient">Enable Gradient Background</Label>
                  <Switch id="enable-gradient" checked={enableGradient} onCheckedChange={setEnableGradient} />
                </div>

                {enableGradient ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="gradient-start">Gradient Start</Label>
                        <div className="flex mt-1">
                          <div
                            className="w-8 h-8 rounded border border-slate-300"
                            style={{ backgroundColor: gradientStart }}
                          />
                          <Input
                            id="gradient-start"
                            type="text"
                            value={gradientStart}
                            onChange={(e) => setGradientStart(e.target.value)}
                            className="ml-2 flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="gradient-end">Gradient End</Label>
                        <div className="flex mt-1">
                          <div
                            className="w-8 h-8 rounded border border-slate-300"
                            style={{ backgroundColor: gradientEnd }}
                          />
                          <Input
                            id="gradient-end"
                            type="text"
                            value={gradientEnd}
                            onChange={(e) => setGradientEnd(e.target.value)}
                            className="ml-2 flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="h-8 w-full rounded-md mt-2"
                      style={{
                        background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="background-color">Background Color</Label>
                    <div className="flex mt-1">
                      <div className="w-8 h-8 rounded border border-slate-300" style={{ backgroundColor }} />
                      <Input
                        id="background-color"
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="ml-2 flex-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Text options */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex mt-1">
                    <div className="w-8 h-8 rounded border border-slate-300" style={{ backgroundColor: textColor }} />
                    <Input
                      id="text-color"
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="ml-2 flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger id="font-family" className="mt-1">
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="sans">Sans-serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="mono">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
              </div>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div
                className="p-4 rounded-md"
                style={{
                  background: enableGradient
                    ? `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
                    : backgroundColor,
                  color: textColor,
                  fontFamily: getFontFamilyValue(fontFamily),
                }}
              >
                <p style={{ fontSize: `${fontSize}px` }}>This is how your text will look in the slides.</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
