export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST request allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai-community/gpt2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.8,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || "Hugging Face API error"
      });
    }

    const generatedText =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "No text generated.";

    return res.status(200).json({ generatedText });
  } catch (error) {
    return res.status(500).json({
      error: "Server error. Check HF token or API."
    });
  }
}