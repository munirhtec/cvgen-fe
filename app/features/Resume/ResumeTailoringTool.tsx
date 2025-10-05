import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { ResumeUpload } from "@/components/resume-upload";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { ExportDocument } from "./ExportDocument";
import { ShowJobDescription } from "./ShowJobDescription";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const cvSchema = z.object({
  personalInformation: z.object({
    fullName: z.string(),
    position: z.string(),
    education: z.string(),
    email: z.email(),
  }),
  brief: z.string(),
  professionalSkills: z.object({
    coreLanguages: z.string(),
    frameworksAndTools: z.string(),
  }),
  languages: z.array(
    z.object({
      language: z.string(),
      level: z.string(),
    })
  ),
  hobbies: z.array(z.string()),
  relevantProjects: z.array(
    z.object({
      businessDomain: z.string(),
      projectDescription: z.string(),
      techStack: z.string(),
      roleAndResponsibilities: z.string(),
    })
  ),
});

export type FormData = z.infer<typeof cvSchema>;

const emptyCV = {
  personalInformation: {
    fullName: "",
    position: "",
    education: "",
    email: "",
  },
  brief: "",
  professionalSkills: {
    coreLanguages: "",
    frameworksAndTools: "",
  },
  languages: [{ language: "", level: "" }],
  hobbies: [""],
  relevantProjects: [
    {
      businessDomain: "",
      projectDescription: "",
      techStack: "",
      roleAndResponsibilities: "",
    },
  ],
};

export default function ResumeTailoringTool() {
  const [originalCV, setOriginalCV] = useState(null);
  const [jobRequirements, setJobRequirements] = useState(null);
  const [tailoredContent, setTailoredContent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sections, setSections] = useState({
    brief: true,
    professionalSkills: true,
    languages: true,
    hobbies: true,
    relevantProjects: true,
  });

  const initialCV = tailoredContent?.cv || originalCV || emptyCV;

  const form = useForm<FormData>({
    resolver: zodResolver(cvSchema),
    defaultValues: initialCV,
  });

  useEffect(() => {
    form.reset(initialCV);
  }, [initialCV, form]);

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control: form.control, name: "languages" });

  const {
    fields: hobbyFields,
    append: appendHobby,
    remove: removeHobby,
  } = useFieldArray({ control: form.control, name: "hobbies" });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({ control: form.control, name: "relevantProjects" });

  const toggleSection = (section) =>
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleResumeUpload = async (file) => {
    console.log("Resume upload:", file);
  };

  const handleJobDescriptionSubmit = async (desc, url) => {
    console.log("Job description submit:", desc, url);
  };

  const handleTailorResume = async () => {
    console.log("Tailoring resume...");
  };

  const [printableHtml, setPrintableHtml] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const el = document.getElementById("printable-resume");
      setPrintableHtml(el?.innerHTML || "");
    }
  }, [form.watch(), sections]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">Resume Tailoring Tool</h1>
        <p className="mb-8 text-muted-foreground">
          Upload your resume, add a job description, and get a tailored resume.
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 h-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-6">
                Live Preview & Edit
              </h2>

              <Form {...form}>
                <section className="space-y-4 mb-6 border-b pb-4">
                  <FormField
                    control={form.control}
                    name="personalInformation.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="text-3xl font-bold" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInformation.position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={jobRequirements?.title || field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="text-xl text-gray-600"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInformation.education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInformation.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </section>

                {sections.brief && (
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Brief</h3>
                    <FormField
                      control={form.control}
                      name="brief"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <textarea
                              {...field}
                              rows={4}
                              className="w-full border border-gray-300 rounded p-2"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </section>
                )}

                {sections.professionalSkills && (
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">
                      Professional Skills
                    </h3>
                    <FormField
                      control={form.control}
                      name="professionalSkills.coreLanguages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Core Programming Languages</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Kotlin, JavaScript, Java"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="professionalSkills.frameworksAndTools"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frameworks / Tools</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. React, SQL, Jest, Git..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </section>
                )}

                {sections.languages && (
                  <section className="mb-8">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-semibold">Languages</h3>
                      <Button
                        size="sm"
                        onClick={() =>
                          appendLanguage({ language: "", level: "" })
                        }
                      >
                        + Add
                      </Button>
                    </div>
                    {languageFields.map((item, index) => (
                      <div key={item.id} className="flex space-x-2 mb-2">
                        <FormField
                          control={form.control}
                          name={`languages.${index}.language`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Language" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`languages.${index}.level`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Level" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeLanguage(index)}
                          className="text-red-500"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </section>
                )}

                {sections.hobbies && (
                  <section className="mb-8">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-semibold">Hobbies</h3>
                      <Button size="sm" onClick={() => appendHobby("")}>
                        + Add
                      </Button>
                    </div>
                    {hobbyFields.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <FormField
                          control={form.control}
                          name={`hobbies.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Hobby" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeHobby(index)}
                          className="text-red-500"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </section>
                )}

                {sections.relevantProjects && (
                  <section className="mb-8">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-semibold">
                        Relevant Projects
                      </h3>
                      <Button
                        size="sm"
                        onClick={() =>
                          appendProject({
                            businessDomain: "",
                            projectDescription: "",
                            techStack: "",
                            roleAndResponsibilities: "",
                          })
                        }
                      >
                        + Add
                      </Button>
                    </div>
                    {projectFields.map((item, index) => (
                      <div key={item.id} className="mb-4 space-y-2">
                        <FormField
                          control={form.control}
                          name={`relevantProjects.${index}.businessDomain`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Domain</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`relevantProjects.${index}.projectDescription`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Description</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`relevantProjects.${index}.techStack`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tech Stack</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`relevantProjects.${index}.roleAndResponsibilities`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role and Responsibilities</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProject(index)}
                          className="text-red-500"
                        >
                          ✕ Remove Project
                        </Button>
                      </div>
                    ))}
                  </section>
                )}
              </Form>
            </Card>
          </div>

          <div className="space-y-6">
            <ExportDocument
              formData={form.getValues()}
              contactName={
                form.getValues("personalInformation.fullName") || "Resume"
              }
              jobTitle={
                jobRequirements?.title ||
                form.getValues("personalInformation.position") ||
                "Position"
              }
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Preview JSON</AccordionTrigger>
                <AccordionContent>
                  <pre className="text-xs h-fit bg-gray-100 p-4 mt-4">
                    {JSON.stringify(form.watch(), null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Card className="p-6">
              <ResumeUpload
                onUpload={handleResumeUpload}
                isProcessing={isProcessing}
                hasResume={!!originalCV}
              />
              <JobDescriptionInput
                onSubmit={handleJobDescriptionSubmit}
                isProcessing={isProcessing}
                hasJobDescription={!!jobRequirements}
              />
              <ShowJobDescription
                jobDescription={jobRequirements?.title || ""}
              />
              {originalCV && jobRequirements && (
                <button
                  onClick={handleTailorResume}
                  disabled={isProcessing}
                  className="w-full bg-primary text-white hover:bg-primary/90 h-11 px-8 rounded-md mt-4 disabled:opacity-50"
                >
                  {isProcessing ? "Tailoring..." : "Tailor Resume"}
                </button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
