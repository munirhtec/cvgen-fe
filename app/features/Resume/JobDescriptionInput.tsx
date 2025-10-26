import React, { useState } from "react";

type JobDescriptionInputProps = {
  onSubmit: (jobDescription: string, jobUrl?: string) => void;
  isProcessing: boolean;
  hasJobDescription: boolean;
};

export function JobDescriptionInput({ onSubmit, isProcessing, hasJobDescription }: JobDescriptionInputProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    onSubmit(jobDescription, jobUrl);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block font-medium mb-1">Job Description</label>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={4}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        disabled={isProcessing}
        placeholder="Paste job description here"
      />
      <label className="block font-medium mb-1">Job URL (optional)</label>
      <input
        type="url"
        className="w-full border rounded p-2 mb-2"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        disabled={isProcessing}
        placeholder="https://"
      />
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-medium disabled:opacity-50"
      >
        {isProcessing ? "Analyzing..." : hasJobDescription ? "Update Job Description" : "Analyze Job Description"}
      </button>
    </form>
  );
}
