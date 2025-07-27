import React, { useState, useEffect } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Code,
  Download,
  Copy,
  Send,
  Image,
  Settings,
  Save,
  FolderOpen,
  Plus,
  User,
  Bot,
  Palette,
  MousePointer,
  Loader2,
  Eye,
  FileCode,
} from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config/config"; // Assuming this path is correct

// Define the theme for the code editor (for react-live)
const codeTheme = {
  plain: {
    color: "#D6DEEB",
    backgroundColor: "#011627"
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#999999"
      }
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7
      }
    },
    {
      types: ["string", "attr-value"],
      style: {
        color: "#E3FFB5"
      }
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#D6DEEB"
      }
    },
    {
      types: ["entity", "url", "symbol", "number", "boolean", "variable", "constant", "property", "regex", "inserted"],
      style: {
        color: "#FFB870"
      }
    },
    {
      types: ["atrule", "keyword", "selector"],
      style: {
        color: "#C792EA"
      }
    },
    {
      types: ["function", "deleted", "tag"],
      style: {
        color: "#82AAFF"
      }
    },
    {
      types: ["function-variable"],
      style: {
        color: "#C792EA"
      }
    },
    {
      types: ["tag-attr", "attr-name"],
      style: {
        color: "#FFCB6B"
      }
    },
    {
      types: ["class-name"],
      style: {
        color: "#FFCB6B"
      }
    },
    {
      types: ["script"],
      style: {
        color: "#82AAFF"
      }
    },
    {
      types: ["builtin"],
      style: {
        color: "#FFCB6B"
      }
    }
  ]
};

// The `scope` for react-live, providing access to React and its hooks
// This is crucial for the generated components to run correctly.
const liveScope = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  // EXPOSE SHADCN/UI COMPONENTS TO REACT-LIVE SCOPE
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
  Badge,
  Avatar,
  AvatarFallback,
};


const MainWorkspace = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJsx, setGeneratedJsx] = useState('');
  const [generatedCss, setGeneratedCss] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      isUser: false,
      text: "Hello! I'm your AI assistant. Describe the component you'd like me to create for you.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [activeTab, setActiveTab] = useState("tsx"); // Default to TSX/JSX tab
  const [currentView, setCurrentView] = useState("preview"); // preview, code

  // Generate component function
  const generateComponent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Clear previous generated code when starting a new generation
    setGeneratedJsx('');
    setGeneratedCss('');

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      isUser: true,
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/llm/generate-component`, {
        prompt: prompt
      }, {withCredentials: true});

      // Check for success and data structure from backend
      console.log(response.data.data.jsx);
      if (response.data.success && response.data.data) {
        setGeneratedJsx(response.data.data.jsx || ''); // Set JSX
        setGeneratedCss(response.data.data.css || ''); // Set CSS

        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          isUser: false,
          text: `I've created a component based on your prompt. Check the 'Preview' and 'Code' tabs on the right!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages(prev => [...prev, aiMessage]);

        // Automatically switch to preview tab after generation
        setCurrentView('preview');
        setActiveTab('tsx'); // Default to JSX tab in code view
      } else {
        throw new Error(response.data.error || 'Unexpected response format from API.');
      }

      setPrompt(""); // Clear prompt input
    } catch (error) {
      console.error('Error generating component:', error);
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        isUser: false,
        text: `Error generating component: ${error.message || 'Please try again.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateComponent();
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    let codeToCopy = '';
    if (activeTab === "tsx") {
      codeToCopy = generatedJsx;
    } else if (activeTab === "css") {
      codeToCopy = generatedCss;
    }

    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => console.log('Code copied to clipboard!'))
        .catch(err => console.error('Failed to copy code:', err));
    }
  };

  // Render preview component
  const renderPreview = () => {
    if (!generatedJsx) {
      return (
        <div className="space-y-6 text-center text-muted-foreground">
          <h3 className="text-lg mb-8">Generated Component Preview</h3>
          <p>Describe a component in the chat to generate its preview here.</p>
          {/* Example buttons for initial state, if desired, but remove the selectedElement logic if not used */}
          <div className="space-x-4">
            <Button
              className={`bg-primary hover:bg-primary/90 shadow-glow ${selectedElement === 'primary-btn' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedElement('primary-btn')}
            >
              Primary Button
            </Button>
            <Button
              variant="secondary"
              className={selectedElement === 'secondary-btn' ? 'ring-2 ring-primary' : ''}
              onClick={() => setSelectedElement('secondary-btn')}
            >
              Secondary
            </Button>
            <Button
              variant="outline"
              className={selectedElement === 'outline-btn' ? 'ring-2 ring-primary' : ''}
              onClick={() => setSelectedElement('outline-btn')}
            >
              Outline
            </Button>
          </div>
          {selectedElement && (
            <div className="mt-4 text-sm flex items-center justify-center">
              <MousePointer className="w-4 h-4 mr-2" /> Element selected - See properties panel →
            </div>
          )}
        </div>
      );
    }

    // Render the generated component preview using react-live
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <LiveProvider code={generatedJsx} scope={liveScope} noInline={true} theme={codeTheme}>
          {/* Apply generated CSS directly to the preview container or within the generated JSX if possible */}
          {generatedCss && (
            <style>{generatedCss}</style>
          )}
          
          <LiveError className="text-red-500 bg-red-100 p-2 rounded-md text-sm whitespace-pre-wrap absolute top-0 left-0 right-0 z-10" />
          <LivePreview className="w-full h-full flex items-center justify-center overflow-auto" />
        </LiveProvider>
      </div>
    );
  };

  // Render code view
  const renderCode = () => {
    if (!generatedJsx && !generatedCss) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No component code generated yet</p>
        </div>
      );
    }

    return (
      <div className="h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-border px-4 flex-shrink-0">
            <TabsList className="bg-transparent">
              <TabsTrigger value="tsx" className="data-[state=active]:bg-accent">TSX/JSX</TabsTrigger>
              <TabsTrigger value="css" className="data-[state=active]:bg-accent">CSS</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="tsx" className="h-full m-0 flex-grow">
            <ScrollArea className="h-full p-4">
              <LiveProvider code={generatedJsx || '// JSX will appear here'} theme={codeTheme}>
                <LiveEditor className="rounded-lg p-4 text-sm font-mono min-h-[150px] overflow-auto bg-gray-900 text-white" />
              </LiveProvider>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="css" className="h-full m-0 flex-grow">
            <ScrollArea className="h-full p-4">
              <textarea
                readOnly
                className="w-full h-full bg-gray-900 text-white rounded-lg p-4 text-sm font-mono overflow-auto resize-none"
                value={generatedCss || '// No additional CSS required or generated'}
              ></textarea>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Chat */}
      <div className="w-80 bg-chat-bg border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">ComponentGen</h1>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Button className="w-full justify-start bg-primary/10 text-primary border-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FolderOpen className="w-4 h-4 mr-2" />
              Load Session
            </Button>
          </div>
        </div>

        {/* Chat Messages with ScrollArea */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4 pb-4">
              {chatMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  isUser={message.isUser}
                  text={message.text}
                  time={message.time}
                />
              ))}
              {isGenerating && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating component...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Describe your component..."
                className="bg-input/50 pr-20"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isGenerating}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                <Button size="sm" variant="ghost" className="p-1">
                  <Image className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1"
                  onClick={generateComponent}
                  disabled={isGenerating || !prompt.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs">
              <Save className="w-3 h-3 mr-1" /> Auto-saved
            </Badge>
          </div>
        </div>
      </div>

      {/* Right Side - Preview & Code */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 bg-preview-bg border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h2 className="font-medium text-foreground">Component Workspace</h2>
            {(generatedJsx || generatedCss) && (
              <Badge variant="secondary">Component Generated!</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={copyCode} disabled={!generatedJsx && !generatedCss}>
              <Copy className="w-4 h-4 mr-2" /> Copy Code
            </Button>
            <Button variant="outline" size="sm" disabled={!generatedJsx && !generatedCss}>
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border flex-shrink-0">
          <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center space-x-2">
                <FileCode className="w-4 h-4" />
                <span>Code</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-preview-bg overflow-auto">
          {currentView === "preview" ? (
            <div className="h-full p-8">
              <div className="h-full bg-card rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
                {renderPreview()}
              </div>
            </div>
          ) : (
            <div className="h-full bg-code-bg">
              {renderCode()}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {selectedElement && (
        <div className="w-80 bg-property-panel-bg border-l border-border p-4 flex-shrink-0">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Palette className="w-5 h-5 mr-2" /> Element Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">{/* Property Controls */}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const ChatMessage = ({ isUser = false, text, time }) => (
  <div className="flex items-start space-x-3">
    <Avatar className="w-8 h-8">
      <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className={`${isUser ? "bg-accent" : "bg-muted"} rounded-lg p-3`}>
        <p className={`text-sm ${isUser ? "text-accent-foreground" : "text-muted-foreground"} break-words`}>{text}</p>
      </div>
      <span className="text-xs text-muted-foreground mt-1 block">{time}</span>
    </div>
  </div>
);

export default MainWorkspace;