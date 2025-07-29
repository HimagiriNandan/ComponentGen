import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSessions, addSession, deleteSession, setActiveSession } from "../store/slices/sessionsSlice";
import { logout } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import SessionService from "../services/sessionService";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  FolderOpen,
  Download,
  Trash2,
  Code,
  MessageSquare,
  Calendar,
  Star,
  Clock,
  LogOut,
} from "lucide-react";

const SessionManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSmall, setDialogSmall] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSession, setNewSession] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessions, activeSession } = useSelector((state) => state.sessions);

  // Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await SessionService.getAllSessions();
        if (response.success) {
          dispatch(setSessions(response.data));
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [dispatch]);

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) =>
    session.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create new session
  const handleCreateSession = async () => {
    if (!newSession.name.trim()) return;

    setCreating(true);
    try {
      const sessionData = {
        prompt: newSession.name,
        description: newSession.description || `Session: ${newSession.name}`,
        tags: [],
        componentsCount: 0,
        chatMessages: [],
        currentJsx: "",
        currentCss: "",
        lastPrompt: newSession.name,
        lastGeneratedJsx: "",
        lastGeneratedCss: "",
        generatedComponents: []
      };

      const response = await SessionService.createSession(sessionData);
      if (response.success) {
        dispatch(addSession(response.data));
        setNewSession({ name: "", description: "" });
        setDialogOpen(false);
        navigate("/workspace");
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setCreating(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (id) => {
    try {
      const response = await SessionService.deleteSession(id);
      if (response.success) {
        dispatch(deleteSession(id));
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Restore session
  const handleRestoreSession = async (session) => {
    try {
      const response = await SessionService.getSessionById(session._id);
      if (response.success) {
        const fullSession = response.data;
        dispatch(setActiveSession(fullSession));
        setDialogSmall(true);
        setTimeout(() => {
          setDialogSmall(false);
          setDialogOpen(false);
          navigate("/workspace");
        }, 300);
      }
    } catch (error) {
      console.error('Error restoring session:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await SessionService.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Even if logout fails, clear local state and redirect
      dispatch(logout());
      navigate("/login");
    }
  };

  // Extract component names from JSX code
  const extractComponentNames = (session) => {
    const componentNames = [];

    // Check current JSX
    if (session.currentJsx) {
      const functionMatch = session.currentJsx.match(/function\s+(\w+)\s*\(/);
      const constMatch = session.currentJsx.match(/const\s+(\w+)\s*=/);

      if (functionMatch) {
        componentNames.push(functionMatch[1]);
      } else if (constMatch) {
        componentNames.push(constMatch[1]);
      }
    }

    // Check chat messages for generated components
    if (session.chatMessages) {
      session.chatMessages.forEach(message => {
        if (message.generatedJsx) {
          const functionMatch = message.generatedJsx.match(/function\s+(\w+)\s*\(/);
          const constMatch = message.generatedJsx.match(/const\s+(\w+)\s*=/);

          if (functionMatch && !componentNames.includes(functionMatch[1])) {
            componentNames.push(functionMatch[1]);
          } else if (constMatch && !componentNames.includes(constMatch[1])) {
            componentNames.push(constMatch[1]);
          }
        }
      });
    }

    return componentNames;
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Sessions</h1>
            <p className="text-muted-foreground">
              Manage and resume your component generation sessions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate("/workspace")}
              className="bg-zinc-900 shadow-button hover:shadow-button-hover cursor-pointer hover:bg-zinc-800"
            >
              <Code className="w-4 h-4 mr-2" />
              Enter Workspace
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-button hover:shadow-button-hover cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  New Session
                </Button>
              </DialogTrigger>
              <DialogContent style={{ maxWidth: dialogSmall ? 400 : 600, transition: 'max-width 0.3s' }} className="shadow-modal bg-black shadow-lg">
                <DialogHeader>
                  <DialogTitle>Create New Session</DialogTitle>
                  <DialogDescription>
                    Start a new component generation session. You can always rename it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Session Name</label>
                    <Input placeholder="e.g., Dashboard Components" className="mt-1 shadow-input focus:shadow-input-focus" value={newSession.name} onChange={e => setNewSession(s => ({ ...s, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description (optional)</label>
                    <Input placeholder="Describe what you're building..." className="mt-1 shadow-input focus:shadow-input-focus" value={newSession.description} onChange={e => setNewSession(s => ({ ...s, description: e.target.value }))} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setNewSession({ name: "", description: "" })} className="shadow-button">Cancel</Button>
                    <Button className="bg-primary hover:bg-primary/90 shadow-button hover:shadow-button-hover" onClick={handleCreateSession} disabled={creating}>{creating ? "Creating..." : "Create Session"}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="shadow-button hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 shadow-input focus:shadow-input-focus"
            />
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992c0-1.664.678-3.217 1.88-4.248L14.12 2.22a9.003 9.003 0 0112.727 12.727l-1.635 1.635c-.933 1.02-2.486 1.698-4.15 1.698H2.985v4.992c0 1.664.678 3.217 1.88 4.248L14.12 2.22a9.003 9.003 0 01-12.727 12.727l-1.635-1.635c-1.02-1.03-1.698-2.583-1.698-4.248v-4.992z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Loading sessions...</h3>
              <p className="text-muted-foreground mb-6">
                Please wait while we fetch your sessions.
              </p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="col-span-full text-center py-12">
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
          ) : (
            filteredSessions.map((session) => {
              const componentNames = extractComponentNames(session);
              return (
                <Card key={session._id} className="hover:shadow-card-hover transition-shadow cursor-pointer group shadow-card bg-zinc-900 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {session.prompt}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {session.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity shadow-button" onClick={() => handleDeleteSession(session._id)}>
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
                        Tags ({componentNames.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {componentNames.slice(0, 3).map((component, index) => (
                          <Badge key={index} variant="secondary" className="text-xs shadow-badge">
                            {component}
                          </Badge>
                        ))}
                        {componentNames.length > 3 && (
                          <Badge variant="secondary" className="text-xs shadow-badge">
                            +{componentNames.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* Session Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {componentNames.length} components
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 shadow-button hover:shadow-button-hover" onClick={() => handleRestoreSession(session)}>
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
              <div className="text-2xl font-bold text-foreground">{sessions.length}</div>
            </CardHeader>
          </Card>
          <Card className="bg-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Components Generated</CardTitle>
              <div className="text-2xl font-bold text-foreground">
                {sessions.reduce((acc, session) => acc + extractComponentNames(session).length, 0)}
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
              <div className="text-2xl font-bold text-foreground">
                {sessions.filter(session => extractComponentNames(session).length > 0).length}
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;