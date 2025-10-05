'use client';

import { useCallback } from 'react';
import { renderToString } from 'react-dom/server';
import { HtecLogo } from '../Navbar/HtecLogo';

type ExportDocProps = {
  formData: any; // Replace with specific type if available
  contactName: string;
  jobTitle: string;
};

function PrintableDocument({ formData }: { formData: any }) {
  return (
    <div className="space-y-4">
      <HtecLogo />

      <h1 className="text-3xl font-bold">{formData.personalInformation.fullName}</h1>
      <h2 className="text-xl text-gray-600">{formData.personalInformation.position}</h2>
      <p>{formData.brief}</p>

      <h3 className="text-lg font-semibold">Professional Skills</h3>
      <p>{formData.professionalSkills.General}</p>

      <h3 className="text-lg font-semibold">Languages</h3>
      <ul>
        {formData.languages.map((lang: any, idx: number) => (
          <li key={idx}>
            {lang.language} - {lang.level}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold">Hobbies</h3>
      <ul>
        {formData.hobbies.map((hobby: string, idx: number) => (
          <li key={idx}>{hobby}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold">Relevant Projects</h3>
      <div>
        {formData.relevantProjects.map((proj: any, idx: number) => (
          <div className="mb-4" key={idx}>
            <strong>Domain:</strong> {proj.businessDomain}
            <br />
            <strong>Description:</strong> {proj.projectDescription}
            <br />
            <strong>Tech Stack:</strong> {proj.techStack}
            <br />
            <strong>Role:</strong> {proj.roleAndResponsibilities}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExportDocument({ formData, contactName, jobTitle }: ExportDocProps) {
  const handlePrint = useCallback(() => {
    if (!formData) return;

    const htmlContent = renderToString(<PrintableDocument formData={formData} />);

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${contactName || 'Resume'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            /* Force background colors to print */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          </style>
        </head>
        <body class="p-6 max-w-3xl mx-auto">
          ${htmlContent}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }, [formData, contactName]);

  return (
    <button
      onClick={handlePrint}
      className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition"
    >
      Export as PDF / Print
    </button>
  );
}
