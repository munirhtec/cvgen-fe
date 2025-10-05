import ResumeTailoringTool from "@/features/Resume/ResumeTailoringTool";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Engineer CV Generator" },
    { name: "description", content: "Engineer CV Generator AI Application made by HTEC Group" },
  ];
}

export default function Home() {
  return <ResumeTailoringTool />
}
