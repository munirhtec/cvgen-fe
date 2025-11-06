import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { RotateCcw, X, ChevronDown } from "lucide-react";
import {
  startDraftAPI,
  submitFeedbackAPI,
  resetFromFaissAPI,
  type CVDraft,
} from "@/lib/cv";
import { ExportCVDraft } from "@/features/Resume/ExportDocument";
import { HtecLogo } from "@/features/Navbar/HtecLogo";

export function meta() {
  return [
    { title: "Resume Chat – CV HTEC AI Assistant" },
    {
      name: "description",
      content:
        "Generate, view, and provide feedback on employee CVs with AI assistance.",
    },
    { property: "og:title", content: "CV Chat – HTEC AI Assistant" },
    {
      property: "og:description",
      content:
        "Generate, view, and provide feedback on employee CVs with AI assistance.",
    },
  ];
}

export default function CVChat() {
  const [query, setQuery] = useState("");
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CVDraft | null>(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetMode, setResetMode] = useState<"fab" | "close" | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (employeeId) url.searchParams.set("employee_id", employeeId);
    else url.searchParams.delete("employee_id");
    window.history.replaceState({}, "", url.toString());
  }, [employeeId]);

  const startDraftMutation = useMutation({
    mutationFn: (query: string) => startDraftAPI(query),
    onSuccess: (data) => {
      setEmployeeId(data.employee_id);
      setDraft(data.draft);
      setQuery("");
      toast.success(data.message);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: ({
      employee_id,
      feedback,
    }: {
      employee_id: string;
      feedback: string;
    }) => submitFeedbackAPI(employee_id, feedback),
    onSuccess: (data) => {
      setDraft(data.draft);
      setFeedbackInput("");
      toast.success(data.message);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const resetFromFaissMutation = useMutation({
    mutationFn: (employee_id: string) => resetFromFaissAPI(employee_id),
    onSuccess: (data) => {
      setDraft(data.draft);
      setEmployeeId(data.employee_id);
      toast.success(data.message);
      setModalLoading(false);
      setIsResetModalOpen(false);
      setResetMode(null);
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setModalLoading(false);
    },
  });

  const startDraft = () => {
    if (!query.trim()) return;
    startDraftMutation.mutate(query);
  };

  const submitFeedback = () => {
    if (!employeeId || !feedbackInput.trim()) return;
    submitFeedbackMutation.mutate({
      employee_id: employeeId,
      feedback: feedbackInput,
    });
  };

  const handleResetConfirm = () => {
    if (resetMode === "fab" && employeeId) {
      setModalLoading(true);
      resetFromFaissMutation.mutate(employeeId);
    } else {
      setDraft(null);
      setEmployeeId(null);
      setQuery("");
      setFeedbackInput("");
      setIsResetModalOpen(false);
      setResetMode(null);
    }
  };

  const showResetButton = draft && draft.feedback.length > 0;

  return (
    <div className="min-h-fit flex flex-col relative">
      {draft?.feedback.length > 0 && (
        <div className="fixed top-24 left-6 z-40">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 shadow-sm">
                Feedback ({draft.feedback.length})
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 text-sm">
              <ul className="space-y-1 text-gray-700 max-h-48 overflow-y-auto">
                {draft.feedback.map((fb, i) => (
                  <li
                    key={i}
                    className="border-b border-gray-100 pb-1 last:border-0"
                  >
                    {typeof fb === "string" ? fb : JSON.stringify(fb)}
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <main className="flex-1 w-full py-8">
        {draft ? (
          <div className="relative bg-white max-w-5xl mx-auto border border-gray-100 shadow-xl p-6 space-y-6">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={() => {
                setResetMode("close");
                setIsResetModalOpen(true);
              }}
            >
              <X size={20} />
            </Button>

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
                  value: draft.cv.personalInformation.fullName,
                },
                {
                  label: "Position:",
                  value: draft.cv.personalInformation.position.join(", "),
                },
                { label: "Email:", value: draft.cv.personalInformation.email },
                {
                  label: "Education:",
                  value: draft.cv.personalInformation.education,
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

            {draft.cv.brief && draft.cv.brief.trim() !== "" && (
              <>
                <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
                  Summary
                </h2>
                <p>{draft.cv.brief}</p>
              </>
            )}

            <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
              Professional Skills
            </h2>
            <div>
              <div className="font-semibold">Core Languages:</div>
              <ul className="list-disc list-inside mb-2">
                {draft.cv.professionalSkills.coreLanguages.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <div className="font-semibold">Frameworks & Tools:</div>
              <ul className="list-disc list-inside">
                {draft.cv.professionalSkills.frameworksAndTools.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {draft.cv.languages.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
                  Languages
                </h2>
                <ul className="list-disc list-inside">
                  {draft.cv.languages.map((l, i) => (
                    <li key={i}>
                      {l.language} - {l.level}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {draft.cv.relevantProjects.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
                  Relevant Projects
                </h2>
                {draft.cv.relevantProjects.map((proj, idx) => (
                  <table
                    className="mb-6 w-full border border-gray-300"
                    key={idx}
                  >
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
                ))}
              </>
            )}

            {draft.cv.hobbies.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold border-b border-gray-300 w-full">
                  Hobbies
                </h2>
                <ul className="list-disc list-inside">
                  {draft.cv.hobbies.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="text-gray-400 text-sm mt-4">
              Generated using CVGen, AI CV Assistant from HTEC
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20 text-sm">
            Start by searching for an employee...
          </div>
        )}
      </main>

      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl flex gap-2 bg-white/30 backdrop-blur-md ring rounded-full shadow-md p-2 transition-all ${
          isInputFocused ? "ring-2 ring-blue-500" : "ring ring-gray-300"
        }`}
      >
        <Input
          autoFocus
          placeholder={draft ? "Add feedback..." : "Search employee..."}
          value={draft ? feedbackInput : query}
          onChange={(e) =>
            draft ? setFeedbackInput(e.target.value) : setQuery(e.target.value)
          }
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") draft ? submitFeedback() : startDraft();
          }}
          className="border-none focus-visible:ring-0 text-sm shadow-none"
        />
        <Button
          className="rounded-full"
          onClick={draft ? submitFeedback : startDraft}
          disabled={
            (draft
              ? feedbackInput.trim().length < 3
              : query.trim().length < 3) ||
            startDraftMutation.isPending ||
            submitFeedbackMutation.isPending
          }
        >
          {draft
            ? submitFeedbackMutation.isPending
              ? "Submitting..."
              : "Send"
            : startDraftMutation.isPending
              ? "Searching..."
              : "Start Draft"}
        </Button>
      </div>

      <div className="fixed flex flex-col justify-end bottom-20 right-6 gap-3">
        <ExportCVDraft draft={draft!} />
        {showResetButton && (
          <Button
            variant="destructive"
            className="rounded-full h-12 px-4 shadow-lg"
            onClick={() => {
              setResetMode("fab");
              setIsResetModalOpen(true);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        )}
      </div>

      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Reset</DialogTitle>
            <DialogDescription>
              {resetMode === "fab"
                ? "This will reset the draft and reload data from FAISS."
                : "Discard the current draft and start over?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetModalOpen(false)}
              disabled={modalLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleResetConfirm} disabled={modalLoading}>
              {modalLoading ? "Processing..." : "Start from scratch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
