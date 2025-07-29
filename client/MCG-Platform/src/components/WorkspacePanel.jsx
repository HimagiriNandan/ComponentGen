import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, Eye, FileCode, LogOut } from "lucide-react";

import PreviewPanel from "./PreviewPanel";

const WorkspacePanel = ({
    generatedJsx,
    generatedCss,
    activeTab,
    setActiveTab,
    currentView,
    setCurrentView,
    copyCode,
    downloadComponent,
    handleLogout,
}) => {
    return (
        <div className="flex-1 flex flex-col min-w-0 bg-black">
            {/* Header */}
            <div className="h-14 bg-black border-b border-border flex items-center justify-between px-4 shadow-header">
                <div className="flex items-center space-x-4">
                    <h2 className="font-medium text-foreground">Component Workspace</h2>
                    {(generatedJsx || generatedCss) && (
                        <Badge variant="secondary" className="shadow-badge">
                            Component Generated!
                        </Badge>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyCode}
                        disabled={!generatedJsx && !generatedCss}
                        className="shadow-button"
                    >
                        <Copy className="w-4 h-4 mr-2" /> Copy Code
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!generatedJsx && !generatedCss}
                        className="shadow-button"
                        onClick={downloadComponent}
                    >
                        <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="shadow-button hover:bg-destructive hover:text-destructive-foreground"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-border flex-shrink-0">
                <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mx-60">
                        <div className="flex items-center justify-between border-b pb-2 my-20">
                            <button
                                disabled
                                className="flex items-center space-x-2 text-gray-500 cursor-default"
                            >
                                <FileCode className="w-4 h-4" />
                                <span>Code</span>
                            </button>
                            <button
                                disabled
                                className="flex items-center space-x-2 text-gray-500 cursor-default"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Preview</span>
                            </button>
                        </div>
                        

                    </TabsList>
                </Tabs>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-black overflow-auto">
                {currentView === "preview" ? (
                    <div className="h-full p-10">
                        <div className="h-full bg-black rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
                            <PreviewPanel
                                generatedJsx={generatedJsx}
                                generatedCss={generatedCss}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </div>
                    </div>
                ) : 
                    <PreviewPanel
                        generatedJsx={generatedJsx}
                        generatedCss={generatedCss}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                }
            </div>
        </div>
    );
};

export default WorkspacePanel;