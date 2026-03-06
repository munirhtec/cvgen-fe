const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("VITE_API_URL is not defined in environment variables");
}

class ApiError extends Error {
  constructor(public status: number, public statusText: string, public detail?: string) {
    super(`API Error: ${status} ${statusText}${detail ? ` - ${detail}` : ""}`);
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...options?.headers as Record<string, string>,
  };

  // Only set Content-Type if there's a body
  if (options?.body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const errorData = await res.json();
      detail = errorData.detail;
    } catch (e) {
      // Ignore valid JSON parse errors for error responses
    }
    throw new ApiError(res.status, res.statusText, detail);
  }

  return res.json();
}

// --- Types ---

export interface EmployeeRecord {
  employee_id: string | number;
  full_name: string;
  email: string;
  current_role: string;
  business_context: string;
  // Add other fields as they appear in the record
  [key: string]: any;
}

export interface EmployeeSuggestion {
  record: EmployeeRecord;
  similarity: number;
}

export interface SuggestionsResponse {
  suggestions: EmployeeSuggestion[];
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
  feedbackHistory: string[];
  lastFeedback: string;
}

// --- API Modules ---

export const rag = {
  load: () => request<{ message: string }>("/rag/load", { method: "POST" }),

  preview: (k: number = 10) =>
    request<{ index_preview: any[] }>(`/rag/preview?k=${k}`),

  getEmployee: (query: string) =>
    request<EmployeeRecord>(`/rag/employee?query=${encodeURIComponent(query)}`),

  getSuggestions: (jobDescription: string, topK: number = 5) =>
    request<SuggestionsResponse>("/rag/suggestions", {
      method: "POST",
      body: JSON.stringify({ job_description: jobDescription, top_k: topK }),
    }),
};

export const helpers = {
  extractJD: (url: string) =>
    request<{ job_description: string }>(`/helpers/extract-jd?url=${encodeURIComponent(url)}`),

  ask: (question: string) =>
    request<{ answer: string }>("/helpers/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
};

export const cv = {
  start: async (
    employeeQuery: string,
    onMessage?: (msg: string) => void
  ): Promise<{ message: string; employee_id: string; draft: any }> => {
    const res = await fetch(`${API_URL}/cv/start/${encodeURIComponent(employeeQuery)}`, {
      method: "POST",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(res.status, res.statusText, errorData.detail);
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result: any;

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.trim() !== "");
      for (const line of lines) {
        try {
          const payload = JSON.parse(line);
          if (payload.type === "message" && onMessage) {
            onMessage(payload.data);
          } else if (payload.type === "error") {
             throw new Error(payload.message);
          } else if (payload.type === "done") {
            result = payload;
          }
        } catch (e) {
          if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
             throw e;
          }
        }
      }
    }
    return result;
  },

  getDraft: (employeeId: string) =>
    request<{ draft: CVDraft }>(`/cv/draft/${employeeId}`),

  review: (employeeId: string) =>
    request<any>(`/cv/review/${employeeId}`, { method: "POST" }),

  refine: (employeeId: string) =>
    request<any>(`/cv/refine/${employeeId}`, { method: "POST" }),

  submitFeedback: async (
    employeeId: string, 
    feedback: string,
    onMessage?: (msg: string) => void
  ): Promise<{ success: boolean; message: string; draft: CVDraft }> => {
    const res = await fetch(`${API_URL}/cv/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId, feedback }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(res.status, res.statusText, errorData.detail);
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result: any;

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.trim() !== "");
      for (const line of lines) {
        try {
          const payload = JSON.parse(line);
          if (payload.type === "message" && onMessage) {
            onMessage(payload.data);
          } else if (payload.type === "error") {
            throw new Error(payload.message);
          } else if (payload.type === "done") {
            result = payload;
          }
        } catch (e) {
           if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
             throw e;
          }
        }
      }
    }
    return result;
  },

  reset: (employeeId: string) =>
    request<{ success: boolean; message: string }>(`/cv/reset/${employeeId}`, {
      method: "POST",
    }),
};
