import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// System prompt for the Gemini model to ensure strict output format
const COMPONENT_SYSTEM_PROMPT = `
You are a strict React functional component generator for a live code editor sandbox.

Your output must:
- Define the component as a function (function or const, but do NOT use export default or any export statements)
- End with a call to render(<ComponentName />) (replace ComponentName with the actual component's name)
- Use ONLY Tailwind CSS utility classes for all styling (do NOT use custom CSS, <style> tags, or CSS-in-JS)
- The 'css' field in your output must always be an empty string or a comment like '/* No custom CSS needed, all styling is via Tailwind classes */'
- Output a single JavaScript code block, and nothing else (no explanations, comments, or extra text)
- The code must be ready to run in a sandboxed environment like react-live with noInline={true}
- If the user prompt does not specify a name, use 'GeneratedComponent' as the component name

Example output:
function GeneratedComponent() {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg">
      Hello from GeneratedComponent!
    </div>
  );
}
render(<GeneratedComponent />);

Output format:
{
  "jsx": "function GeneratedComponent() {\\n  return (\\n    <div className=\\"bg-blue-500 text-white p-4 rounded-lg\\">\\n      Hello from GeneratedComponent!\\n    </div>\\n  );\\n}\\nrender(<GeneratedComponent />);",
  "css": "/* No custom CSS needed, all styling is via Tailwind classes */"
}
`;

router.post("/generate-component", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Initialize the Google Generative AI client
    // Ensure process.env.GOOGLE_API_KEY is correctly set in your .env file
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Send the prompt to the Gemini model with the strict system instruction
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [{ text: COMPONENT_SYSTEM_PROMPT }] // System instruction as a Part
      },
      generationConfig: {
        responseMimeType: "application/json", // Request JSON output directly
        responseSchema: { // Define the expected JSON schema for the model
          type: "OBJECT",
          properties: {
            "jsx": { "type": "STRING" },
            "css": { "type": "STRING" }
          },
          required: ["jsx", "css"]
        }
      }
    });

    
    const responseText = result.response.text();

    console.log("🔍 Raw Gemini Response Text:", responseText);

    let componentData;
    try {
      componentData = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({
        error: "Failed to parse JSON from AI response. Response was not valid JSON.",
        rawResponse: responseText, // Include the raw response for debugging
        parseError: parseError.message,
      });
    }

    // Validate the parsed data structure
    if (typeof componentData.jsx !== 'string' || typeof componentData.css !== 'string') {
      return res.status(500).json({
        error: "AI response did not contain valid 'jsx' or 'css' strings.",
        receivedData: componentData,
        rawResponse: responseText
      });
    }
    // Additional validation: ensure code ends with render(...) and does not contain export
    if (!/render\s*\(/.test(componentData.jsx) || /export\s+default|export\s+/.test(componentData.jsx)) {
      return res.status(500).json({
        error: "Generated code must end with a render(...) call and must not contain export statements.",
        receivedData: componentData,
        rawResponse: responseText
      });
    }

    console.log(componentData.jsx);
    // Success: return the extracted JSX and CSS
    return res.json({
    
      success: true,
      data: {
        jsx: componentData.jsx,
        css: componentData.css,
      },
    });

  } catch (err) {
    console.error("❌ Component generation failed:", err);
    // Provide a more detailed error message for the client
    return res.status(500).json({
      error: "Component generation failed at the server.",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Include stack in dev mode
    });
  }
});

export default router;
