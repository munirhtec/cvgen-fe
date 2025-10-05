import { ask } from "@/actions/api-actions";
import { Form, useActionData, useNavigation } from "react-router";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const message = formData.get("message") ?? "";

    if (typeof message !== "string" || message.trim() === "") {
      return { error: "Message cannot be empty." };
    }

    const response = await ask(message);
    const { answer } = response;
    return { answer };
  } catch (err: any) {
    console.error("Action error:", err);
    return { error: "An error occurred while processing your request." };
  }
}

export default function TestChat() {
  const actionData = useActionData() as {
    answer?: string;
    error?: string;
  };
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";

  const {
    register,
    formState: { errors },
  } = useForm<{ message: string }>({
    mode: "onTouched",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Form
        method="post"
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            {...register("message", { required: "Message is required" })}
            name="message"
            placeholder="Type your message here..."
            className="resize-none"
            aria-invalid={errors.message ? "true" : "false"}
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? "Asking..." : "Ask"}
        </Button>

        {actionData?.answer && (
          <div className="mt-4 p-3 border rounded bg-green-50 text-green-800">
            <strong>AI Response:</strong>
            <p>{actionData.answer}</p>
          </div>
        )}

        {actionData?.error && (
          <div className="mt-4 p-3 border rounded bg-red-50 text-red-800">
            <strong>Error:</strong>
            <p>{actionData.error}</p>
          </div>
        )}
      </Form>
    </div>
  );
}
