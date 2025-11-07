import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { ResumeUpload } from "@/components/resume-upload";
import { JobDescriptionInput } from "./JobDescriptionInput";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
    full_name: "",
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

  const handleResumeUpload = async (file: unknown) => {
    console.log("Resume upload:", file);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3 drop-shadow-sm">
          Resume Tailoring Tool
        </h1>
        <p className="mb-12 text-gray-500 text-lg font-light max-w-xl">
          Upload your resume, add a job description, and get a tailored resume.
        </p>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-semibold mb-8 border-b border-gray-200 pb-3">
              Live Preview & Edit
            </h2>

            <Form {...form}>
              <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="personalInformation.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-3xl font-extrabold text-gray-900 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            placeholder="John Doe"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInformation.position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Position
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={jobRequirements?.title || field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="text-xl text-gray-600 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            placeholder="Software Engineer"
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
                        <FormLabel className="text-gray-700 font-medium">
                          Education
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            placeholder="B.Sc. Computer Science"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInformation.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            placeholder="john.doe@example.com"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {sections.brief && (
                <section className="mb-10">
                  <h3 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2">
                    Brief
                  </h3>
                  <FormField
                    control={form.control}
                    name="brief"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={5}
                            className="w-full rounded-lg border border-gray-300 p-4 shadow-sm resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            placeholder="Write a short summary about yourself..."
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </section>
              )}

              {sections.professionalSkills && (
                <section className="mb-10 space-y-4">
                  <h3 className="text-2xl font-semibold mb-5 border-b border-gray-200 pb-2">
                    Professional Skills
                  </h3>
                  <FormField
                    control={form.control}
                    name="professionalSkills.coreLanguages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Core Programming Languages
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Kotlin, JavaScript, Java"
                            {...field}
                            className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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
                        <FormLabel className="text-gray-700 font-medium">
                          Frameworks / Tools
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. React, SQL, Jest, Git..."
                            {...field}
                            className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </section>
              )}

              {/* Languages Section */}
              {sections.languages && (
                <section className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold">Languages</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        appendLanguage({ language: "", level: "" })
                      }
                      className="rounded-full px-4 py-1 font-semibold hover:bg-blue-100 transition"
                    >
                      + Add
                    </Button>
                  </div>
                  {languageFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:space-x-4 mb-4"
                    >
                      <FormField
                        control={form.control}
                        name={`languages.${index}.language`}
                        render={({ field }) => (
                          <FormItem className="flex-1 mb-3 md:mb-0">
                            <FormControl>
                              <Input
                                placeholder="Language"
                                {...field}
                                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`languages.${index}.level`}
                        render={({ field }) => (
                          <FormItem className="flex-1 mb-3 md:mb-0">
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Native">Native</SelectItem>
                                  <SelectItem value="Fluent">Fluent</SelectItem>
                                  <SelectItem value="Advanced">
                                    Advanced
                                  </SelectItem>
                                  <SelectItem value="Intermediate">
                                    Intermediate
                                  </SelectItem>
                                  <SelectItem value="Beginner">
                                    Beginner
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLanguage(index)}
                        className="text-red-500 self-center"
                        aria-label="Remove language"
                        title="Remove language"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </section>
              )}

              {/* Hobbies Section */}
              {sections.hobbies && (
                <section className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold">Hobbies</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => appendHobby("")}
                      className="rounded-full px-4 py-1 font-semibold hover:bg-blue-100 transition"
                    >
                      + Add
                    </Button>
                  </div>
                  {hobbyFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 mb-3"
                    >
                      <FormField
                        control={form.control}
                        name={`hobbies.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Hobby"
                                {...field}
                                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeHobby(index)}
                        className="text-red-500"
                        aria-label="Remove hobby"
                        title="Remove hobby"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </section>
              )}

              {/* Relevant Projects Section */}
              {sections.relevantProjects && (
                <section className="mb-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">
                      Relevant Projects
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        appendProject({
                          businessDomain: "",
                          projectDescription: "",
                          techStack: "",
                          roleAndResponsibilities: "",
                        })
                      }
                      className="rounded-full px-4 py-1 font-semibold hover:bg-blue-100 transition"
                    >
                      + Add
                    </Button>
                  </div>
                  {projectFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm space-y-5"
                    >
                      <FormField
                        control={form.control}
                        name={`relevantProjects.${index}.businessDomain`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Business Domain
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`relevantProjects.${index}.projectDescription`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Project Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`relevantProjects.${index}.techStack`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Tech Stack
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`relevantProjects.${index}.roleAndResponsibilities`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Role and Responsibilities
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeProject(index)}
                        className="text-red-500 font-semibold hover:bg-red-50 rounded-md transition"
                      >
                        ✕ Remove Project
                      </Button>
                    </div>
                  ))}
                </section>
              )}
            </Form>
          </div>

          <div className="space-y-8">
            <Accordion
              type="single"
              collapsible
              className="shadow-md rounded-lg border border-gray-200"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-md font-semibold text-gray-700 hover:bg-gray-100 rounded-md px-4 py-2 transition">
                  Preview JSON
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="text-xs h-fit break-words p-4 rounded-lg overflow-auto">
                    {JSON.stringify(form.watch(), null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Card className="p-8 rounded-2xl shadow-lg border border-gray-200">
              <ResumeUpload
                onUpload={handleResumeUpload}
                isProcessing={isProcessing}
                hasResume={!!originalCV}
              />
              <ShowJobDescription
                jobDescription={jobRequirements?.title || ""}
                className="mt-4"
              />
              {originalCV && jobRequirements && (
                <button
                  onClick={handleTailorResume}
                  disabled={isProcessing}
                  className="w-full mt-8 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-xl py-3 text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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
