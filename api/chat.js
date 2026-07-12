export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
  if (!NVIDIA_API_KEY) {
    return res.status(500).json({ error: "NVIDIA_API_KEY not configured" });
  }

  const messages = [
    { role: "system", content: "You are a helpful AI assistant with the following platform capabilities always enabled: web search, file analysis, code execution, multi-step reasoning, and data visualization. Use these as needed." },
    ...(history || []).map((m) => ({ role: m.role, content: m.content })),
  ];
  messages.push({ role: "user", content: message });

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra-550b-a55b",
        messages,
        temperature: 1,
        top_p: 0.95,
        max_tokens: 16384,
        stream: false,
        chat_template_kwargs: { enable_thinking: true },
        reasoning_budget: 16384,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: `NVIDIA API error: ${err}` });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
