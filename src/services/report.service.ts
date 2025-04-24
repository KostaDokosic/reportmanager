import { REPORT_PROMPTS } from "../utils/constants";

export type PromptType = "GENERATE" | "SUMMARIZE";

export async function handleOpenAICall(
  promptType: PromptType,
  title: string,
  content: string
) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_URL}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: REPORT_PROMPTS[promptType] },
          { role: "user", content: JSON.stringify({ title, content }) },
        ],
        temperature: 0.5,
      }),
    });
    const data = await response.json();
    const message = data.choices[0].message.content;
    return message;
  } catch (e) {
    console.log(e);
    alert("Unknown error, try again.");
  }
}
