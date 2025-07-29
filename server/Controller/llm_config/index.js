import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// System prompt for the Gemini model to ensure strict output format for Sandpack
const COMPONENT_SYSTEM_PROMPT = `
You are a strict React functional component generator for a Sandpack code editor environment.

Your output must:
- Define the component as a function (function or const) and export it as default
- Use regular CSS classes for styling (NOT Tailwind classes)
- Generate custom CSS in the 'css' field that matches the styling requirements
- Output a single JavaScript code block, and nothing else (no explanations, comments, or extra text)
- The code must be ready to run in a Sandpack React environment
- If the user prompt does not specify a name, use 'GeneratedComponent' as the component name
- DO NOT use render() calls - Sandpack handles the rendering automatically
- Use semantic class names like 'container', 'button', 'card', etc.

Example output:
function GeneratedComponent() {
  return (
    <div className="container">
      <h1 className="title">Hello from GeneratedComponent!</h1>
      <button className="button">Click me</button>
    </div>
  );
}
export default GeneratedComponent;

Output format:
{
  "jsx": "function GeneratedComponent() {\\n  return (\\n    <div className=\\"container\\">\\n      <h1 className=\\"title\\">Hello from GeneratedComponent!</h1>\\n      <button className=\\"button\\">Click me</button>\\n    </div>\\n  );\\n}\\nexport default GeneratedComponent;",
  "css": ".container {\\n  padding: 1rem;\\n  background-color: #3b82f6;\\n  color: white;\\n  border-radius: 0.5rem;\\n}\\n\\n.title {\\n  font-size: 1.5rem;\\n  font-weight: bold;\\n  margin-bottom: 1rem;\\n}\\n\\n.button {\\n  background-color: #10b981;\\n  color: white;\\n  padding: 0.5rem 1rem;\\n  border: none;\\n  border-radius: 0.25rem;\\n  cursor: pointer;\\n}\\n\\n.button:hover {\\n  background-color: #059669;\\n}"
}
`;

router.post("/generate-component", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [{ text: COMPONENT_SYSTEM_PROMPT }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: { 
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
    console.log(responseText);

    let componentData;
    try {
      componentData = JSON.parse(responseText);
    } catch (parseError) {
      console.log(parseError);
      return res.status(500).json({
        error: "Failed to parse JSON from AI response. Response was not valid JSON.",
        rawResponse: responseText, 
        parseError: parseError.message,
      });
    }

    if (typeof componentData.jsx !== 'string' || typeof componentData.css !== 'string') {
      return res.status(500).json({
        error: "AI response did not contain valid 'jsx' or 'css' strings.",
        receivedData: componentData,
        rawResponse: responseText
      });
    }

    // Validate that CSS contains actual styles (not just comments)
    if (!componentData.css.trim() || componentData.css.trim().startsWith('/*')) {
      return res.status(500).json({
        error: "Generated CSS must contain actual styles, not just comments.",
        receivedData: componentData,
        rawResponse: responseText
      });
    }
    if (!/export\s+default/.test(componentData.jsx) || /render\s*\(/.test(componentData.jsx)) {
      return res.status(500).json({
        error: "Generated code must use 'export default' and must not contain render() calls for Sandpack compatibility.",
        receivedData: componentData,
        rawResponse: responseText
      });
    }

    console.log(componentData.jsx);
    return res.json({
    
      success: true,
      data: {
        jsx: componentData.jsx,
        css: componentData.css,
      },
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Component generation failed at the server.",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
});

export default router;