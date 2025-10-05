import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ResumeData, TailoredContent } from "@/app/page"
import { Plus, Minus, Edit } from "lucide-react"

interface ResumePreviewProps {
  originalResume: ResumeData
  tailoredResume?: ResumeData
  changes?: TailoredContent["changes"]
}

export function ResumePreview({ originalResume, tailoredResume, changes }: ResumePreviewProps) {
  const resume = tailoredResume || originalResume
  const showChanges = !!tailoredResume && !!changes

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{resume.contact.name}</CardTitle>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              {resume.contact.email} • {resume.contact.phone}
            </p>
            <p>{resume.contact.location}</p>
          </div>
        </CardHeader>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Professional Summary
            {showChanges && changes.modifiedSummary && (
              <Badge variant="secondary" className="text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Modified
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => {
              let variant: "default" | "secondary" | "destructive" = "default"
              let icon = null

              if (showChanges) {
                if (changes.addedSkills.includes(skill)) {
                  variant = "secondary"
                  icon = <Plus className="w-3 h-3 mr-1" />
                } else if (changes.removedSkills.includes(skill)) {
                  variant = "destructive"
                  icon = <Minus className="w-3 h-3 mr-1" />
                }
              }

              return (
                <Badge key={index} variant={variant} className="text-xs">
                  {icon}
                  {skill}
                </Badge>
              )
            })}
          </div>

          {showChanges && (changes.addedSkills.length > 0 || changes.removedSkills.length > 0) && (
            <div className="mt-4 text-xs text-muted-foreground">
              <p>
                <span className="text-green-600">Green: Added skills</span> •
                <span className="text-red-600 ml-2">Red: Removed skills</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Professional Experience
            {showChanges && changes.modifiedExperience > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Edit className="w-3 h-3 mr-1" />
                {changes.modifiedExperience} positions updated
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-muted pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{exp.title}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <span className="text-xs text-muted-foreground">{exp.duration}</span>
              </div>
              <ul className="text-sm space-y-1">
                {exp.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {resume.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{edu.degree}</p>
                <p className="text-xs text-muted-foreground">{edu.school}</p>
              </div>
              <span className="text-xs text-muted-foreground">{edu.year}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
