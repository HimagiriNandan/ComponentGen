import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/config/config";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, email } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/user/login`,
        { email: loginEmail, password: loginPassword },
        { withCredentials: true }
      );
      if (res.status === 200) {
        const userRes = await axios.get(`${BACKEND_URL}/api/user/me`, { withCredentials: true });
        console.log(userRes.data);
        if (userRes.data.user) {
          dispatch(setUser(userRes.data.user));
          navigate("/dashboard");
        } else {
          setError(userRes.data.message);
        }
      }       
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/user/signup`,
        { name: signupName, email: signupEmail, password: signupPassword },
        { withCredentials: true }
      );
      if (res.status === 200) { 
        const userRes = await axios.get(`${BACKEND_URL}/api/user/me`, { withCredentials: true });
        console.log(userRes.data);
        if (userRes.data.user) {
          dispatch(setUser(userRes.data.user));
          navigate("/dashboard");
        } else {
          setError(userRes.data.message);
        }
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ComponentGen</h1>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-soft">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      className="bg-input/50"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      className="bg-input/50"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-input/50"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      placeholder="name@example.com"
                      type="email"
                      className="bg-input/50"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      className="bg-input/50"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="bg-input/50"
                      value={signupConfirmPassword}
                      onChange={e => setSignupConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid gap-3">
              <Button variant="outline" className="w-full" disabled>
                <span className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <span className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground mt-6">
              By clicking continue, you agree to our{" "}
              <a href="#" className="underline hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;