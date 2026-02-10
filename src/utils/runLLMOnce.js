// src/utils/runLLMOnce.js
export function createRunLLMOnce({ callLLM, delayMs = 1200 }) {
  let busy = false;

  return async function runLLMOnce(params) {
    if (busy) {
      console.warn("Gemini blocked: already running");
      return "Too many requests right now. Please wait a bit and try again.";
    }

    busy = true;

    try {
      const aiText = await callLLM(params);
      return aiText;
    } finally {
      setTimeout(() => {
        busy = false;
      }, delayMs);
    }
  };
}
