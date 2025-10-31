// src/components/job/JobDescriptionInput/JobDescriptionInput.tsx

import React, { useState } from "react";
import type { CandidateResponse, JobDescriptionInputProps } from "./types";
import { JobDescriptionForm } from "./JobDescriptionForm";
import { JobResults } from "./JobResults";

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  isProcessing,
  hasJobDescription,
}) => {
  const [tab, setTab] = useState<"description" | "url">("description");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CandidateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isProcessing) return;

    setError(null);
    setResults([]);
    setLoading(true);

    try {
      let descriptionToAnalyze = jobDescription;

      // 🧩 Step 1 — if URL tab, fetch JD from helper first
      if (tab === "url") {
        if (!jobUrl.trim()) {
          setError("Please enter a valid job URL.");
          setLoading(false);
          return;
        }

        console.log("🌐 Fetching job description from URL:", jobUrl);

        const helperResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/helpers/extract-jd?url=${encodeURIComponent(
            jobUrl
          )}`
        );

        if (!helperResponse.ok)
          throw new Error(`Failed to fetch JD from URL (HTTP ${helperResponse.status})`);

        const helperData = await helperResponse.json();
        console.log("✅ /helpers/extract-jd result:", helperData);

        if (!helperData?.job_description) {
          throw new Error("No job description found for this URL.");
        }

        descriptionToAnalyze = helperData.job_description;
        setJobDescription(descriptionToAnalyze);
      }

      // 🧩 Step 2 — send JD to suggestions
      if (!descriptionToAnalyze.trim()) {
        setError("Job description is empty.");
        setLoading(false);
        return;
      }

      console.log("🚀 Sending JD to /rag/suggestions");

      const suggestionResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/rag/suggestions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_description: descriptionToAnalyze, top_k: 5 }),
        }
      );

      if (!suggestionResponse.ok)
        throw new Error(`Failed to get suggestions (HTTP ${suggestionResponse.status})`);

      const data = await suggestionResponse.json();
      console.log("✅ /rag/suggestions response:", data);

      const parsedResults: CandidateResponse[] = Array.isArray(data)
        ? data
        : data.suggestions || [];

      setResults(parsedResults);
    } catch (err: any) {
      console.error("❌ Error analyzing job:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || isProcessing;

  return (
    <div className="space-y-6">
      <JobDescriptionForm
        tab={tab}
        setTab={setTab}
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        jobUrl={jobUrl}
        setJobUrl={setJobUrl}
        isBusy={isBusy}
        onSubmit={handleSubmit}
        hasJobDescription={hasJobDescription}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <JobResults results={results} />
    </div>
  );
};
