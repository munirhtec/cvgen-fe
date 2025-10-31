// src/components/job/JobDescriptionInput/JobResults.tsx

import React from "react";
import { type CandidateResponse } from "./types";

interface JobResultsProps {
  results: CandidateResponse[];
}

// 🎯 Helper: determine color and label based on similarity %
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

export const JobResults: React.FC<JobResultsProps> = ({ results }) => {
  if (!results.length) return null;

  return (
    <div className="border-t pt-5">
      <h3 className="font-semibold text-lg mb-3 text-foreground">
        Best Candidate Matches
      </h3>

      <ul className="space-y-3">
        {results.map(({ record, similarity }, index) => {
          const { label, color, bar } = getSimilarityLevel(similarity);
          return (
            <li
              key={record.employee_id || index}
              className="group p-4 border rounded-lg bg-card hover:bg-accent transition-colors cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => console.log("🧩 Candidate record:", record)}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium text-base text-foreground group-hover:text-primary transition-colors">
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

                {/* Right-side badge */}
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

              {/* Progress bar */}
              <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${bar} transition-all duration-500`}
                  style={{
                    width: `${Math.min(similarity, 100)}%`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
