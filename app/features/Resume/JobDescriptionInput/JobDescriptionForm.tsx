// src/components/job/JobDescriptionInput/JobDescriptionForm.tsx

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
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
  <form onSubmit={onSubmit} className="space-y-4">
    <Tabs value={tab} onValueChange={(v) => setTab(v as "description" | "url")}>
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="description">Job Description</TabsTrigger>
        <TabsTrigger value="url">Job URL</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-2 mt-2">
        <label className="block font-medium mb-1">Job Description</label>
        <textarea
          className="w-full border rounded p-2"
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isBusy}
          placeholder="Paste the job description here..."
        />
      </TabsContent>

      <TabsContent value="url" className="space-y-2 mt-2">
        <label className="block font-medium mb-1">Job URL</label>
        <input
          type="url"
          className="w-full border rounded p-2"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          disabled={isBusy}
          placeholder="https://example.com/job"
        />
      </TabsContent>
    </Tabs>

    <button
      type="submit"
      disabled={isBusy}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-medium disabled:opacity-50"
    >
      {isBusy
        ? "Analyzing..."
        : tab === "description"
          ? hasJobDescription
            ? "Update Job Description"
            : "Analyze Job Description"
          : "Analyze from URL"}
    </button>
  </form>
);
