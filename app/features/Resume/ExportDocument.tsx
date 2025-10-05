"use client";

import { useCallback } from "react";
import { renderToString } from "react-dom/server";
import { HtecLogo } from "../Navbar/HtecLogo";
import type { FormData } from "./ResumeTailoringTool";

type ExportDocProps = {
  formData: any; // Replace with specific type if available
  contactName: string;
  jobTitle: string;
};

function PrintableDocument({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 text-gray-400">
        <HtecLogo />

        <div className="pl-4 border-l border-gray-300">
          <div className="uppercase leading-tight text-xs">
            <div>TEAM</div>
            <div>MEMBER</div>
            <div>PROFILE</div>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-semibold border-b border-gray-300 w-full">Personal Information</h1>
      <div className="flex flex-col gap-2">
        {[
          {
            label: "Full Name:",
            value: formData.personalInformation?.fullName,
          },
          { label: "Position:", value: formData.personalInformation?.position },
          {
            label: "Education:",
            value: formData.personalInformation?.education,
          },
          {
            label: "Contact Email:",
            value: formData.personalInformation?.email,
          },
        ]
          .filter(({ value }) => value && value.trim() !== "")
          .map(({ label, value }) => (
            <div key={label} className="flex">
              <div className="font-bold w-32">{label}</div>
              <div>{value}</div>
            </div>
          ))}
      </div>

      {formData.brief && formData.brief.trim() !== "" && (
        <>
          <h1 className="text-2xl font-semibold border-b border-gray-300 w-full">Brief</h1>
          <p>{formData.brief}</p>
        </>
      )}

      <h1 className="text-2xl font-semibold border-b border-gray-300 w-full">Professional Skills</h1>
      <div className="flex flex-col gap-2">
        {formData.professionalSkills?.coreLanguages &&
          formData.professionalSkills.coreLanguages.trim() !== "" && (
            <div className="flex gap-2">
              <div className="font-bold">Core programming languages:</div>
              <div>{formData.professionalSkills.coreLanguages}</div>
            </div>
          )}
        {formData.professionalSkills?.frameworksAndTools &&
          formData.professionalSkills.frameworksAndTools.trim() !== "" && (
            <div className="flex gap-2">
              <div className="font-bold">Software tools/Frameworks:</div>
              <div>{formData.professionalSkills.frameworksAndTools}</div>
            </div>
          )}
      </div>

      <div className="flex space-x-6">
        {formData.languages &&
          formData.languages.some(
            (lang: { language?: string; level?: string }) =>
              lang.language?.trim() !== "" && lang.level?.trim() !== ""
          ) && (
            <div className="w-1/2">
              <h1 className="text-xl font-semibold mb-2">Languages</h1>
              <ul className="flex flex-col gap-2">
                {formData.languages
                  .filter(
                    (lang: { language?: string; level?: string }) =>
                      lang.language?.trim() !== "" && lang.level?.trim() !== ""
                  )
                  .map(
                    (
                      lang: { language: string; level: string },
                      idx: number
                    ) => (
                      <li key={idx}>
                        {lang.language} ({lang.level})
                      </li>
                    )
                  )}
              </ul>
            </div>
          )}

        {formData.hobbies?.length > 0 && (
          <div className="w-1/2">
            <h1 className="text-xl font-semibold mb-2">Hobbies</h1>
            <ul>
              <li>{formData.hobbies.join(", ")}</li>
            </ul>
          </div>
        )}
      </div>

      {formData.relevantProjects?.length > 0 && (
        <>
          <h1 className="text-2xl font-semibold border-b border-gray-300 w-full">Relevant Projects</h1>
          {formData.relevantProjects.map(
            (
              proj: {
                businessDomain: string;
                projectDescription: string;
                techStack: string;
                roleAndResponsibilities: string;
              },
              idx: number
            ) => (
              <table className="mb-6 w-full border border-gray-300" key={idx}>
                <tbody>
                  {proj.businessDomain && (
                    <tr>
                      <td className="font-semibold bg-blue-100 border border-gray-300 px-2 py-1 w-32">
                        Domain
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {proj.businessDomain}
                      </td>
                    </tr>
                  )}
                  {proj.projectDescription && (
                    <tr>
                      <td className="font-semibold bg-blue-100 border border-gray-300 px-2 py-1">
                        Description
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {proj.projectDescription}
                      </td>
                    </tr>
                  )}
                  {proj.techStack && (
                    <tr>
                      <td className="font-semibold bg-blue-100 border border-gray-300 px-2 py-1">
                        Tech Stack
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {proj.techStack}
                      </td>
                    </tr>
                  )}
                  {proj.roleAndResponsibilities && (
                    <tr>
                      <td className="font-semibold bg-blue-100 border border-gray-300 px-2 py-1">
                        Role
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {proj.roleAndResponsibilities}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )
          )}
        </>
      )}
    </div>
  );
}

export function ExportDocument({
  formData,
  contactName,
  jobTitle,
}: ExportDocProps) {
  const handlePrint = useCallback(() => {
    if (!formData) return;

    const htmlContent = renderToString(
      <PrintableDocument formData={formData} />
    );

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${contactName || "Resume"}</title>
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
