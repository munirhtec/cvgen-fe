import { useCallback } from "react";
import { renderToString } from "react-dom/server";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { CVDraft } from "@/lib/cv";
import { HtecLogo } from "../Navbar/HtecLogo";

function PrintableCVDraft({ draft }: { draft: CVDraft }) {
  const cv = draft.cv;

  return (
    <div className="space-y-6">
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

      <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
        Personal Information
      </h2>
      <div className="flex flex-col gap-2">
        {[
          {
            label: "Full Name:",
            value: cv.personalInformation.fullName,
          },
          {
            label: "Position:",
            value: cv.personalInformation.position.join(", "),
          },
          {
            label: "Email:",
            value: cv.personalInformation.email,
          },
          {
            label: "Education:",
            value: cv.personalInformation.education,
          },
        ]
          .filter(({ value }) => value && value.trim() !== "")
          .map(({ label, value }) => (
            <div key={label} className="flex">
              <div className="font-bold w-40">{label}</div>
              <div>{value}</div>
            </div>
          ))}
      </div>

      {cv.brief && cv.brief.trim() !== "" && (
        <>
          <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
            Summary
          </h2>
          <p>{cv.brief}</p>
        </>
      )}

      <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
        Professional Skills
      </h2>
      <div>
        <div className="font-semibold">Core Languages:</div>
        <ul className="list-disc list-inside mb-2">
          {cv.professionalSkills.coreLanguages.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <div className="font-semibold">Frameworks & Tools:</div>
        <ul className="list-disc list-inside">
          {cv.professionalSkills.frameworksAndTools.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {cv.languages.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
            Languages
          </h2>
          <ul className="list-disc list-inside">
            {cv.languages.map((l, i) => (
              <li key={i}>
                {l.language} - {l.level}
              </li>
            ))}
          </ul>
        </>
      )}

      {cv.relevantProjects.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
            Relevant Projects
          </h2>
          {cv.relevantProjects.map(
            (
              proj: {
                businessDomain: string;
                projectDescription: string;
                techStack: string[];
                roleAndResponsibilities: string[];
              },
              idx: number
            ) => (
              <table className="mb-6 w-full border border-gray-300" key={idx}>
                <tbody>
                  {proj.businessDomain && (
                    <tr>
                      <td className="w-1/4 font-semibold bg-blue-100 border border-gray-300 px-2 py-1">
                        Domain
                      </td>
                      <td className="border border-gray-300 px-2 py-1 whitespace-pre-line">
                        {proj.businessDomain}
                      </td>
                    </tr>
                  )}
                  {proj.projectDescription && (
                    <tr>
                      <td className="w-1/4 font-semibold bg-blue-100 border border-gray-300 px-2 py-1">
                        Description
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {proj.projectDescription}
                      </td>
                    </tr>
                  )}
                  {proj.techStack?.length > 0 && (
                    <tr>
                      <td className="w-1/4 font-semibold bg-blue-100 border border-gray-300 px-2 py-1">
                        Tech Stack
                      </td>
                      <td className="border border-gray-300 px-2 py-1 whitespace-pre-line">
                        {proj.techStack.join(", ")}
                      </td>
                    </tr>
                  )}
                  {proj.roleAndResponsibilities?.length > 0 && (
                    <tr>
                      <td className="w-1/4 font-semibold bg-blue-100 border border-gray-300 px-2 py-1">
                        Role
                      </td>
                      <td className="border border-gray-300 px-2 py-1 whitespace-pre-line">
                        {proj.roleAndResponsibilities.join("\n")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )
          )}
        </>
      )}

      {cv.hobbies.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
            Hobbies
          </h2>
          <ul className="list-disc list-inside">
            {cv.hobbies.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </>
      )}

      <div className="text-gray-400 text-sm mt-4">
        Generated using CVGen, AI CV Assistant from HTEC
      </div>
    </div>
  );
}

export function ExportCVDraft({ draft }: { draft: CVDraft }) {
  const handlePrint = useCallback(() => {
    if (!draft) return;

    const htmlContent = renderToString(<PrintableCVDraft draft={draft} />);

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const doc = printWindow.document;
    doc.open();

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${draft.cv.personalInformation.fullName || "CV Draft"}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          </style>
          <script>
            window.addEventListener('load', () => {
              window.focus();
              window.print();
            });
          </script>
        </head>
        <body class="p-6 max-w-3xl mx-auto">
          ${htmlContent}
        </body>
      </html>
    `;

    doc.write(fullHTML);
    doc.close();
  }, [draft]);

  return (
    <Button
      onClick={handlePrint}
      className="shadow-md h-10 flex items-center gap-2"
      disabled={!draft}
    >
      <Download />
      Export as PDF / Print
    </Button>
  );
}
