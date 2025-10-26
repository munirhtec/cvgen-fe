import React from "react";

type UploadResumeProps = {
  onUpload: (file: File) => void;
  isProcessing: boolean;
  hasResume: boolean;
};

export function UploadResume({ onUpload, isProcessing, hasResume }: UploadResumeProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Upload Resume</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        disabled={isProcessing}
        onChange={handleFileChange}
        className="mb-4"
      />
      {hasResume && <p className="text-green-600">Resume uploaded.</p>}
    </div>
  );
}
