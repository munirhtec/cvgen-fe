import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TailoredContent } from "@/app/page"
import { Download, FileText, Mail } from "lucide-react"
import { toast } from "sonner"

interface ExportOptionsProps {
  tailoredContent: TailoredContent
  jobTitle: string
}

export function ExportOptions({ tailoredContent, jobTitle }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (type: "resume" | "cover-letter" | "both") => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          content: tailoredContent,
          jobTitle,
        }),
      })

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type === "both" ? "tailored-documents" : type}-${jobTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast("Export successful");
    } catch (error) {
      toast("Export failed")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => handleExport("resume")}
          disabled={isExporting}
          variant="outline"
          className="w-full justify-start"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download Tailored Resume (PDF)
        </Button>

        <Button
          onClick={() => handleExport("cover-letter")}
          disabled={isExporting}
          variant="outline"
          className="w-full justify-start"
        >
          <Mail className="w-4 h-4 mr-2" />
          Download Cover Letter (PDF)
        </Button>

        <Button onClick={() => handleExport("both")} disabled={isExporting} className="w-full justify-start">
          <Download className="w-4 h-4 mr-2" />
          Download Both Documents (PDF)
        </Button>

        {isExporting && <p className="text-xs text-muted-foreground text-center">Generating PDF documents...</p>}
      </CardContent>
    </Card>
  )
}
