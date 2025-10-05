import { Card } from "@/components/ui/card";
import type { CV } from "./ResumeTailoringTool";

export function ResumeJsonPreview({ cvToShow }: { cvToShow: CV }) {
  return (
    <Card className="p-6 mt-4 overflow-auto max-h-96 bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Saved CV JSON</h3>
      <pre className="text-xs whitespace-pre-wrap break-words">
        {JSON.stringify(cvToShow, null, 2)}
      </pre>
    </Card>
  );
}
