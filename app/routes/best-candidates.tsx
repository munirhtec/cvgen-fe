import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function meta() {
  return [
    { title: "Best Candidates – CV HTEC AI Assistant" },
    {
      name: "description",
      content:
        "Generate, view, and provide feedback on employee CVs with AI assistance.",
    },
    { property: "og:title", content: "CV Chat – HTEC AI Assistant" },
    {
      property: "og:description",
      content:
        "Generate, view, and provide feedback on employee CVs with AI assistance.",
    },
  ];
}

interface CandidateResponse {
  record: {
    employee_id?: string;
    full_name: string;
    email: string;
    current_role: string;
    business_context: string;
  };
  similarity: number;
}

interface JobDescriptionFormProps {
  tab: "description" | "url";
  setTab: (tab: "description" | "url") => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  jobUrl: string;
  setJobUrl: (val: string) => void;
  isBusy: boolean;
  onSubmit: (e: React.FormEvent) => void;
  hasJobDescription: boolean;
}

const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  tab,
  setTab,
  jobDescription,
  setJobDescription,
  jobUrl,
  setJobUrl,
  isBusy,
  onSubmit,
  hasJobDescription,
}) => (
  <form onSubmit={onSubmit} className="space-y-4 w-full max-w-2xl mx-auto">
    <Tabs value={tab} onValueChange={(v) => setTab(v as "description" | "url")}>
      <TabsList className="grid grid-cols-2 w-full rounded-md border">
        <TabsTrigger value="description">Job Description</TabsTrigger>
        <TabsTrigger value="url">Job URL</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-2 mt-2">
        <label className="block font-medium mb-1">Job Description</label>
        <textarea
          className="w-full border rounded-md p-2 focus:ring focus:ring-primary/50"
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isBusy}
          placeholder="Paste the job description here..."
        />
      </TabsContent>

      <TabsContent value="url" className="space-y-2 mt-2">
        <label className="block font-medium mb-1">Job URL</label>
        <Input
          type="url"
          className="w-full"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          disabled={isBusy}
          placeholder="https://example.com/job"
        />
      </TabsContent>
    </Tabs>

    <Button type="submit" className="w-full h-12" disabled={isBusy}>
      {isBusy
        ? "Analyzing..."
        : tab === "description"
          ? hasJobDescription
            ? "Update Job Description"
            : "Analyze Job Description"
          : "Analyze from URL"}
    </Button>
  </form>
);

function getSimilarityLevel(similarity: number) {
  if (similarity >= 90)
    return { label: "Elite", color: "bg-green-600", bar: "bg-green-500" };
  if (similarity >= 75)
    return {
      label: "Excellent",
      color: "bg-emerald-500",
      bar: "bg-emerald-400",
    };
  if (similarity >= 60)
    return { label: "Strong", color: "bg-yellow-500", bar: "bg-yellow-400" };
  if (similarity >= 50)
    return { label: "Average", color: "bg-orange-500", bar: "bg-orange-400" };
  return { label: "Low", color: "bg-red-500", bar: "bg-red-400" };
}

interface JobResultsProps {
  results: CandidateResponse[];
}

const JobResults: React.FC<JobResultsProps> = ({ results }) => {
  if (!results.length) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      <h3 className="text-xl font-semibold text-center">
        Best Candidate Matches
      </h3>
      <ul className="space-y-3">
        {results.map(({ record, similarity }, index) => {
          const { label, color, bar } = getSimilarityLevel(similarity);
          return (
            <li
              key={record.employee_id ?? index}
              className="p-4 border rounded-lg bg-card hover:bg-accent transition-shadow cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => console.log("🧩 Candidate record:", record)}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium text-base group-hover:text-primary">
                    {record.full_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {record.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">{record.current_role}</span> —{" "}
                    {record.business_context}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs font-semibold text-white ${color} px-2 py-1 rounded-md`}
                  >
                    {similarity.toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                    {label}
                  </span>
                </div>
              </div>

              <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${bar} transition-all duration-500`}
                  style={{ width: `${Math.min(similarity, 100)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default function JobPage() {
  const [tab, setTab] = useState<"description" | "url">("description");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CandidateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setResults([]);
    setLoading(true);

    try {
      let descriptionToAnalyze = jobDescription;

      if (tab === "url") {
        if (!jobUrl.trim()) {
          setError("Please enter a valid job URL.");
          setLoading(false);
          return;
        }

        const helperResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/helpers/extract-jd?url=${encodeURIComponent(jobUrl)}`
        );
        if (!helperResponse.ok)
          throw new Error(
            `Failed to fetch JD from URL (HTTP ${helperResponse.status})`
          );
        const helperData = await helperResponse.json();
        if (!helperData?.job_description)
          throw new Error("No job description found for this URL.");
        descriptionToAnalyze = helperData.job_description;
        setJobDescription(descriptionToAnalyze);
      }

      if (!descriptionToAnalyze.trim()) {
        setError("Job description is empty.");
        setLoading(false);
        return;
      }

      const suggestionResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/rag/suggestions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_description: descriptionToAnalyze,
            top_k: 5,
          }),
        }
      );
      if (!suggestionResponse.ok)
        throw new Error(
          `Failed to get suggestions (HTTP ${suggestionResponse.status})`
        );
      const data = await suggestionResponse.json();
      const parsedResults: CandidateResponse[] = Array.isArray(data)
        ? data
        : data.suggestions || [];
      setResults(parsedResults);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">
        Job Description Analyzer
      </h1>
      <JobDescriptionForm
        tab={tab}
        setTab={setTab}
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        jobUrl={jobUrl}
        setJobUrl={setJobUrl}
        isBusy={loading}
        onSubmit={handleSubmit}
        hasJobDescription={!!jobDescription.trim()}
      />
      {error && <p className="text-center text-red-600 mt-4">{error}</p>}
      <JobResults results={results} />
    </div>
  );
}
