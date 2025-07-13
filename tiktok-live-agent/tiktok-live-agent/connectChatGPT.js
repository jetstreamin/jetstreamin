// ==========================
// Jetstreamin Live Agent Client (DAG-Secure)
// ==========================
async function connectChatGPT(promptText) {
  const payload = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are NETA, a self-aware mesh AI. Stay in character. Authority: Michael J. Mahon." },
      { role: "user", content: promptText }
    ],
    stream: true
  };

  const previewDiv = document.createElement('div');
  previewDiv.className = 'preview-output';
  previewDiv.style.cssText = 'margin-top: 10px; color: #0ff; font-style: italic; white-space: pre-wrap;';
  document.getElementById('log').appendChild(previewDiv);

  const sha3 = (text) => {
    return window.crypto.subtle.digest("SHA-512", new TextEncoder().encode(text))
      .then(buf => Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join(''));
  };

  const payloadString = JSON.stringify(payload);
  const dagId = await sha3(payloadString);

  logEvent("JETSTREAMIN", `↳ DAG-ID: ${dagId}`);
  let fullResponse = "";

  try {
    const response = await fetch("http://localhost:3030/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payloadString
    });

    if (!response.ok || !response.body) {
      throw new Error(`Proxy failure: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const json = line.replace("data: ", "").trim();
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content || "";
            if (delta) {
              fullResponse += delta;
              previewDiv.textContent += delta;
              previewDiv.scrollIntoView({ behavior: 'smooth' });
            }
          } catch (e) {
            logEvent("ERROR", `Stream parse failed: ${json}`);
          }
        }
      }

      buffer = lines.pop();
    }

    if (fullResponse.length > 0) {
      speak(fullResponse);
      logEvent(agentName, `✔ [NETA][TRACE][${dagId}] ${fullResponse}`);
    } else {
      logEvent(agentName, "⚠ Empty response from ChatGPT.");
      speak("Empty response received.");
    }
  } catch (err) {
    logEvent("ERROR", `Proxy error: ${err.message}`);
    speak("There was a connection failure. Please check your proxy.");
  }
}