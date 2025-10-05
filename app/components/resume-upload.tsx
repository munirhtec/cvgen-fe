import type React from "react"
import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Check, AlertCircle, Loader2 } from "lucide-react"

interface ResumeUploadProps {
  onUpload: (file: File) => void
  isProcessing: boolean
  hasResume: boolean
}

export function ResumeUpload({ onUpload, isProcessing, hasResume }: ResumeUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const processFile = useCallback(
    (file: File) => {
      console.log("Processing file:", file.name, file.type, file.size)
      setUploadError(null)
      setSelectedFile(file)

      // Basic validation
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
      ]

      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!validTypes.includes(file.type)) {
        const error = `Invalid file type: ${file.type}. Please upload PDF, DOCX, or TXT files.`
        console.error(error)
        setUploadError(error)
        return
      }

      if (file.size > maxSize) {
        const error = "File size must be less than 10MB"
        console.error(error)
        setUploadError(error)
        return
      }

      if (file.size === 0) {
        const error = "File appears to be empty"
        console.error(error)
        setUploadError(error)
        return
      }

      console.log("File validation passed, calling onUpload")
      onUpload(file)
    },
    [onUpload],
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("File input changed")
      const file = event.target.files?.[0]
      if (file) {
        console.log("File selected:", file.name)
        processFile(file)
      } else {
        console.log("No file selected")
      }
      // Reset the input so the same file can be selected again
      event.target.value = ""
    },
    [processFile],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setDragOver(false)
      console.log("File dropped")

      const files = event.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        console.log("Dropped file:", file.name)
        processFile(file)
      }
    },
    [processFile],
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    console.log("Upload button clicked")
    const input = document.getElementById("resume-file-input") as HTMLInputElement
    if (input) {
      input.click()
    }
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        {hasResume ? <Check className="w-5 h-5 text-green-500" /> : <FileText className="w-5 h-5" />}
        Upload Resume
      </h3>

      <Card
        className={`border-dashed border-2 transition-colors cursor-pointer ${
          dragOver ? "border-primary bg-primary/5" : "hover:border-primary/50"
        } ${isProcessing ? "opacity-50" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <CardContent className="p-6">
          <div className="text-center">
            {isProcessing ? (
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
            ) : (
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isProcessing
                  ? "Processing your resume..."
                  : hasResume
                    ? "Resume uploaded successfully"
                    : "Upload your current resume"}
              </p>
              <p className="text-xs text-muted-foreground">Supports PDF, DOCX, and TXT files</p>
              <p className="text-xs text-muted-foreground">
                {dragOver ? "Drop your file here" : "Drag and drop or click to browse"}
              </p>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                disabled={isProcessing}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : hasResume ? (
                  "Upload New Resume"
                ) : (
                  "Choose File"
                )}
              </Button>
            </div>

            {selectedFile && (
              <p className="text-xs text-muted-foreground mt-2">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        id="resume-file-input"
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileChange}
        className="hidden"
        disabled={isProcessing}
      />

      {uploadError && (
        <div className="text-sm text-red-600 flex items-start gap-2 bg-red-50 p-3 rounded-md">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Upload Error</p>
            <p>{uploadError}</p>
          </div>
        </div>
      )}

      {hasResume && !uploadError && (
        <div className="text-sm text-green-600 flex items-center gap-2 bg-green-50 p-3 rounded-md">
          <Check className="w-4 h-4" />
          Resume parsed and ready for editing
        </div>
      )}

      <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
        <p className="font-medium mb-1">💡 Tips for best results:</p>
        <ul className="space-y-1">
          <li>• TXT files work best for accurate parsing</li>
          <li>• Use clear section headers like "Skills", "Experience", "Education"</li>
          <li>• Make sure your file isn't corrupted or password-protected</li>
        </ul>
      </div>
    </div>
  )
}
