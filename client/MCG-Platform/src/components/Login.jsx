import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-card/50 rounded-lg flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ComponentGen</h1>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm shadow-card hover:shadow-card-hover">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Welcome</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
                <TabsTrigger value="signin" className="text-zinc-400 data-[state=active]:bg-zinc data-[state=active]:text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-zinc-400 data-[state=active]:bg-zinc data-[state=active]:text-white">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-4 pt-3">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-300">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-800">{error}</div>}
                  <Button
                    className="w-full shadow-button hover:shadow-button-hover bg-secondary text-white font-medium"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 pt-3">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-zinc-300">Email</Label>
                    <Input
                      id="signup-email"
                      placeholder="name@example.com"
                      type="email"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-zinc-300">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-zinc-300">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                      value={signupConfirmPassword}
                      onChange={e => setSignupConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-800">{error}</div>}
                  <Button
                    className="w-full bg-secondary shadow-button hover:shadow-button-hover text-white font-medium"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;