import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Check, Link } from "lucide-react"

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string, jobUrl?: string) => void
  isProcessing: boolean
  hasJobDescription: boolean
}

export function JobDescriptionInput({ onSubmit, isProcessing, hasJobDescription }: JobDescriptionInputProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [activeTab, setActiveTab] = useState("paste")

  const handleSubmit = () => {
    if (activeTab === "paste" && jobDescription.trim()) {
      onSubmit(jobDescription.trim())
    } else if (activeTab === "url" && jobUrl.trim()) {
      onSubmit("", jobUrl.trim())
    }
  }

  const isValid = (activeTab === "paste" && jobDescription.trim()) || (activeTab === "url" && jobUrl.trim())

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        {hasJobDescription ? <Check className="w-5 h-5 text-green-500" /> : <Briefcase className="w-5 h-5" />}
        Job Description
      </h3>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">Paste Text</TabsTrigger>
              <TabsTrigger value="url">Job URL</TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-4">
              <div>
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the complete job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="job-url">Job Posting URL</Label>
                <div className="flex gap-2 mt-2">
                  <Link className="w-5 h-5 mt-2.5 text-muted-foreground" />
                  <Input
                    id="job-url"
                    type="url"
                    placeholder="https://company.com/jobs/position"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">We'll extract the job description from the URL</p>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleSubmit} disabled={!isValid || isProcessing} className="w-full mt-4">
            {isProcessing ? "Analyzing..." : "Analyze Job Requirements"}
          </Button>
        </CardContent>
      </Card>

      {hasJobDescription && (
        <div className="text-sm text-green-600 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Job requirements analyzed and ready
        </div>
      )}
    </div>
  )
}
