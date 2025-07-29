import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Zap, Layers, Users, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-border/10 backdrop-blur-sm bg-zinc-900 shadow-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-button">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">ComponentGen</h1>
          </div>
          <div className="space-x-3">
            <Button variant="outline" onClick={() => navigate('/login')} className="shadow-button hover:shadow-button-hover">Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 shadow-badge">
            AI-Powered Component Generation
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Build React Components
            <span className="text-primary block">with Natural Language</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Generate, preview, and export production-ready React components using AI. 
            Iterate with chat, customize with visual editors, and download complete code packages.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-button hover:shadow-button-hover" onClick={() => navigate('/workspace')}>
              Start Creating
            </Button>
            <Button size="lg" variant="outline" className="shadow-button hover:shadow-button-hover" onClick={() => navigate('/workspace')} >
              <Eye className="w-4 h-4 mr-2" />
              Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything you need to build faster
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/20 shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 shadow-button">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Generation</CardTitle>
                <CardDescription>
                  Describe components in natural language and watch them come to life instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20 shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 shadow-button">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See your components render in real-time with interactive previews
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20 shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 shadow-button">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Code Export</CardTitle>
                <CardDescription>
                  Download complete TSX/JSX and CSS files ready for production
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20 shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 shadow-button">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Visual Editor</CardTitle>
                <CardDescription>
                  Fine-tune properties with intuitive sliders, color pickers, and controls
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20 shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 shadow-button">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>
                  Save your work, resume sessions, and maintain full chat history
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/20 shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 shadow-button">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Iterative Refinement</CardTitle>
                <CardDescription>
                  Continuously improve components through conversational feedback
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-secondary border-border/20 shadow-card">
            <CardHeader>
              <CardTitle className="text-3xl text-foreground">
                Ready to revolutionize your workflow?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of developers creating components faster than ever before
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="shadow-button hover:shadow-button-hover" onClick={() => navigate('/workspace')}>
                Get Started for Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 ComponentGen. Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;