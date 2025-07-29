import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCode, Eye } from "lucide-react";


const PreviewPanel = ({ generatedJsx, generatedCss, activeTab, setActiveTab }) => {
  // If no JSX is generated, show empty state
  if (!generatedJsx) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 00-4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.118 2.846l-.382.383m0 0l-.384.381a9.065 9.065 0 01-2.846-6.118L3 3.104m0 0v5.714a2.25 2.25 0 01-.659 1.591L5 14.5" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No component generated yet</h3>
          <p className="text-muted-foreground">
            Describe the component you want to create in the chat and I'll generate it for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-[0_4px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_6px_32px_rgba(0,0,0,0.75)] transition-all duration-300"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b border-border px-4 flex-shrink-0 ">
          <TabsList className="bg-transparent">
            {/* <TabsTrigger value="tsx" className="data-[state=active]:bg-accent">
              TSX/JSX
            </TabsTrigger>
            <TabsTrigger value="css" className="data-[state=active]:bg-accent">
              CSS
            </TabsTrigger> */}
          </TabsList>
        </div>
        <div className="flex items-center justify-between border-b border-zinc-700 pb-2 px-4 relative z-10 bg-zinc-900 mx-40">
          <button
            disabled
            className="flex items-center space-x-2 text-gray-300 cursor-default"
          >
            <FileCode className="w-4 h-4" />
            <span>Code</span>
          </button>
          <button
            disabled
            className="flex items-center space-x-2 text-gray-300 cursor-default"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
        <TabsContent value="tsx" className="h-full m-0 flex-grow">
          <ScrollArea className="h-full p-4">
            <Sandpack
              template="react"
              theme={sandpackDark}
              customSetup={{
                dependencies: {
                  react: "18.2.0",
                  "react-dom": "18.2.0",
                },
              }}
              options={{
                showLineNumbers: true,
                wrapContent: true,
                editorHeight: "80vh",
                showTabs: false,
              }}
              files={{
                "/App.js": {
                  code: generatedJsx || "// JSX code not found",
                  active: true,
                },
                "/styles.css": {
                  code: generatedCss || "/* CSS styles */",
                },
                "/index.js": {
                  code: `
                    import React from "react";
                    import { createRoot } from "react-dom/client";
                    import App from "./App";
                    import "./styles.css";

                    const container = document.getElementById("root");
                    const root = createRoot(container);
                    root.render(<App />);
                  `.trim(),
                },
                "/index.html": {
                  code: '<div id="root"></div>',
                },
              }}
            />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="css" className="h-full m-0 flex-grow">
          <ScrollArea className="h-full p-4">
            <textarea
              readOnly
              className="w-full h-full bg-gray-900 text-white rounded-lg p-4 text-sm font-mono overflow-auto resize-none"
              value={generatedCss || "/* No additional CSS required or generated */"}
            ></textarea>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreviewPanel;