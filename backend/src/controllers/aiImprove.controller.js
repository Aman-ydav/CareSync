import "../config.js";

const API_KEY = (process.env.GENAI_API_KEY || "").trim();
const MODEL = (process.env.GENAI_MODEL || "gemini-2.5-flash").trim();

const SYSTEM = `
You are a medical text rewriting assistant.

Your job is to:
1) Rewrite text in a clean, readable, clinical tone.
2) Expand the explanation with more descriptive, human-friendly, safe wording.
3) Keep the original meaning.
4) Add context-based supporting details, but do NOT diagnose or recommend treatments.

Strong rules:
❌ Do NOT diagnose the patient.
❌ Do NOT prescribe medication.
❌ Do NOT give treatment plans.
❌ Do NOT imply certainty about medical causes.
✔ Only enhance the writing and add more detail.
✔ Use neutral, professional tone.
✔ The output should feel like a doctor summarizing patient's concern.

If the text is empty:
Generate a helpful generic text with placeholder language based on the context.
Example placeholders:
- "The patient is seeking consultation..."
- "Symptoms have been recently noticed..."

Output Format:
Provide only the improved text. No explanations.
`;

export const improveText = async (req, res) => {
  try {
    const { text = "", context = "" } = req.body;

    // 🔥 MULTI-STAGE PROMPT:
    // 1) rewrite
    // 2) expand logically & safely
    const prompt = `
${SYSTEM}

Context information:
${context}

Original text:
"${text}"

Now rewrite this text to be:
- More detailed
- More descriptive
- Longer
- Clean medical tone
- Maintain meaning
- Add safe contextual explanation
- Make it feel like a professionally written clinical note

Provide the final improved text only:
    `.trim();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    let result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!result) {
      result = "No improvement generated.";
    }

    return res.json({ result });
  } catch (e) {
    console.error(e);
    return res.json({
      result: "AI unavailable right now. Try again later.",
    });
  }
};
