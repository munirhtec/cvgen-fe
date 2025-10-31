// src/components/job/JobDescriptionInput/types.ts

export type EmploymentHistory = {
  role: string;
  start_date: string;
  end_date: string | null;
  responsibilities: string;
};

export type WorkExperience = {
  project_id: string;
  project_name: string;
  role: string;
  responsibilities: string;
  performance_metrics?: Record<string, any>;
};

export type CandidateRecord = {
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  current_role: string;
  employment_history: EmploymentHistory[];
  education: string;
  work_experience: WorkExperience[];
  business_context: string;
  endorsements: any[];
};

export type CandidateResponse = {
  record: CandidateRecord;
  similarity: number;
};

export type JobDescriptionInputProps = {
  isProcessing: boolean;
  hasJobDescription: boolean;
};
