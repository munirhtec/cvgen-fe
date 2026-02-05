"use server";

import { helpers } from "@/lib/api";

export async function ask(question: string) {
  try {
    const data = await helpers.ask(question);
    return data;
  } catch (error: any) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }
}
