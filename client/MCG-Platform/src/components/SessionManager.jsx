import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Clock, 
  Code, 
  Trash2, 
  Star, 
  FolderOpen,
  Plus,
  Calendar,
  MessageSquare,
  Download
} from "lucide-react";

const SessionManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock session data
  const sessions = [
    {
      id: 1,
      name: "E-commerce Product Card",
      description: "Modern product card with hover animations and cart functionality",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-16",
      messageCount: 12,
      isStarred: true,
      components: ["ProductCard", "AddToCartButton", "PriceDisplay"],
      thumbnail: null
    },
    {
      id: 2,
      name: "Dashboard Navigation",
      description: "Responsive sidebar navigation with icons and collapsible menu",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-15",
      messageCount: 8,
      isStarred: false,
      components: ["Sidebar", "NavItem", "UserProfile"],
      thumbnail: null
    },
    {
      id: 3,
      name: "Login Form Components",
      description: "Complete authentication form set with validation and error handling",
      createdAt: "2024-01-13",
      updatedAt: "2024-01-14",
      messageCount: 15,
      isStarred: true,
      components: ["LoginForm", "InputField", "SubmitButton", "ErrorMessage"],
      thumbnail: null
    },
    {
      id: 4,
      name: "Blog Post Layout",
      description: "Article layout with typography, tags, and social sharing",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-13",
      messageCount: 6,
      isStarred: false,
      components: ["ArticleHeader", "ContentBlock", "TagList", "ShareButtons"],
      thumbnail: null
    }
  ];

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Sessions</h1>
            <p className="text-muted-foreground">
              Manage and resume your component generation sessions
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
                <DialogDescription>
                  Start a new component generation session. You can always rename it later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Session Name</label>
                  <Input placeholder="e.g., Dashboard Components" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Input placeholder="Describe what you're building..." className="mt-1" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-primary hover:bg-primary/90">Create Session</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              <Star className="w-3 h-3 mr-1" />
              Starred
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              <Clock className="w-3 h-3 mr-1" />
              Recent
            </Badge>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {session.name}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {session.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    {session.isStarred && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Components Preview */}
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Code className="w-4 h-4 mr-1" />
                    Components ({session.components.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {session.components.slice(0, 3).map((component, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {component}
                      </Badge>
                    ))}
                    {session.components.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{session.components.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Session Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {session.messageCount} messages
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Create your first session to get started"}
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Session
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
              <div className="text-2xl font-bold text-foreground">{sessions.length}</div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Components Generated</CardTitle>
              <div className="text-2xl font-bold text-foreground">
                {sessions.reduce((acc, session) => acc + session.components.length, 0)}
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages Exchanged</CardTitle>
              <div className="text-2xl font-bold text-foreground">
                {sessions.reduce((acc, session) => acc + session.messageCount, 0)}
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;