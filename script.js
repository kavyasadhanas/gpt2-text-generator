async function generateText() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (!prompt.trim()) {
    output.innerText = "Please enter a prompt first.";
    return;
  }

  output.innerText = "Generating text...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.error) {
      output.innerText = "Error: " + data.error;
    } else {
      output.innerText = data.generatedText;
    }
  } catch (error) {
    output.innerText = "Failed to connect to server.";
  }
}
