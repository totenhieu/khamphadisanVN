const BASE_URL = "http://tenhieu1-001-site1.ktempurl.com/api";

export const askAIAssistant = async (question: string) => {
  const res = await fetch(`${BASE_URL}/ai/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "AI Error");
  }

  const data = await res.json();
  return data.answer;
};
