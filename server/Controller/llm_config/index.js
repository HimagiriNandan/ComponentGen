import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// System prompt for the Gemini model to ensure strict output format
const COMPONENT_SYSTEM_PROMPT = `
You are a strict React functional component generator.
Your task is to generate ONLY the JSX code for the component and its associated Tailwind CSS classes or custom CSS.
Do NOT include any explanations, comments, introductions, or any other text outside the specified JSON format.
Ensure the component is a functional React component and uses modern React practices (e.g., hooks if needed).

Output must be a raw JSON object with two keys: "jsx" and "css".
The "jsx" value should be a string containing the complete React JSX code.
The "css" value should be a string containing only the Tailwind CSS classes used or any necessary custom CSS.
End with a call to render(<ComponentName />) (replace ComponentName with the actual component's name)
The code must be ready to run in a sandboxed environment like react-live with noInline={true}
If the user prompt does not specify a name, use 'GeneratedComponent' as the component name

Example of desired output format:
{
  "jsx": "import React from 'react';\\n\\nconst MyComponent = () => {\\n  return (\\n    <div className=\\"bg-blue-500 text-white p-4 rounded-lg\\">\\n      Hello from MyComponent!\\n    </div>\\n  );\\n};\\n\\nrender(<ComponentName />);",
  "css": "/* No custom CSS needed, only Tailwind classes */"
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
