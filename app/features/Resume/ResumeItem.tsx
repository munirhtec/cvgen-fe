"use client";

import React from "react";

type Experience = {
  title: string;
  company?: string;
  duration?: string;
  bullets?: string[];
};

type Education = {
  degree: string;
  school: string;
  year?: string;
};

type Project = {
  name: string;
  description?: string;
};

type ResumeSection = Experience | Education | Project;

type ResumeItemProps = {
  item: ResumeSection;
  type: "experience" | "education" | "project";
};

export function ResumeItem({ item, type }: ResumeItemProps) {
  switch (type) {
    case "experience": {
      const exp = item as Experience;
      return (
        <div className="mb-4 border-l-4 border-primary pl-4">
          <div className="font-semibold text-lg">{exp.title}</div>
          {exp.company && <div className="italic text-sm text-gray-600">{exp.company}</div>}
          {exp.duration && <div className="text-xs text-gray-400">{exp.duration}</div>}
          {exp.bullets && exp.bullets.length > 0 && (
            <ul className="list-disc list-inside mt-1 space-y-1">
              {exp.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    case "education": {
      const edu = item as Education;
      return (
        <div className="mb-4">
          <div className="font-semibold">{edu.degree}</div>
          <div className="italic text-gray-600">{edu.school}</div>
          {edu.year && <div className="text-xs text-gray-400">{edu.year}</div>}
        </div>
      );
    }

    case "project": {
      const proj = item as Project;
      return (
        <div className="mb-4">
          <div className="font-semibold">{proj.name}</div>
          {proj.description && <div>{proj.description}</div>}
        </div>
      );
    }

    default:
      return null;
  }
}
