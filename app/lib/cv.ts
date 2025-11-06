const API_URL = import.meta.env.VITE_API_URL;

export interface WorkExperience {
  type: string;
  role: string;
  organization?: string;
  start_date?: string;
  end_date?: string;
  responsibilities?: string;
  performance_metrics?: string;
}

export interface CVDraft {
  employee_id: string;
  draft_id?: string;
  cv: {
    personalInformation: {
      fullName: string;
      position: string[];
      email: string;
      education: string;
    };
    brief: string;
    professionalSkills: {
      coreLanguages: string[];
      frameworksAndTools: string[];
    };
    languages: {
      language: string;
      level: string;
    }[];
    relevantProjects: {
      businessDomain: string;
      projectDescription: string;
      techStack: string[];
      roleAndResponsibilities: string[];
    }[];
    hobbies: string[];
  };
  feedback: string[];
}


export const startDraftAPI = async (query: string) => {
  const res = await fetch(`${API_URL}/cv/start/${encodeURIComponent(query)}`, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Employee not found");
  }
  return res.json();
};

export const submitFeedbackAPI = async (employee_id: string, feedback: string) => {
  const res = await fetch(`${API_URL}/cv/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employee_id, feedback }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to submit feedback");
  }
  return res.json();
};

export const resetFromFaissAPI = async (employee_id: string) => {
  const res = await fetch(`${API_URL}/cv/start/${encodeURIComponent(employee_id)}`, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to reload draft");
  }
  return res.json();
};
