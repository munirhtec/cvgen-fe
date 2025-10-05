"use server";

const API_URL = import.meta.env.VITE_API_URL;

export async function ask(question: string) {
  const res = await fetch(`${API_URL}/llm/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}
