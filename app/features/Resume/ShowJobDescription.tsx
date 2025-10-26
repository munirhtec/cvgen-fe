type ShowJobDescriptionProps = {
  jobDescription: string;
};

export function ShowJobDescription({
  jobDescription,
}: ShowJobDescriptionProps) {
  if (!jobDescription || !jobDescription.trim()) return null;

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded border">
      <h3 className="text-lg font-semibold mb-2">Job Description</h3>
      <pre className="whitespace-pre-wrap text-sm">{jobDescription}</pre>
    </div>
  );
}
