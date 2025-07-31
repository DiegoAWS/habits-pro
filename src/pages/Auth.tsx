import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const { signIn, signUp, user, resetPassword } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Set active tab based on URL path
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('signup');
    } else {
      setActiveTab('signin');
    }
  }, [location.pathname]);

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'signup') {
      navigate('/register', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Validation helpers
  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === repeatPassword;
  const isSignUpFormValid = email && isPasswordValid && doPasswordsMatch && repeatPassword;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address first.",
      });
      return;
    }

    const { error } = await resetPassword(email);

    if (error) {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Reset link sent",
        description: "If an email exists, it was sent a link with instructions.",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if passwords match
    if (password !== repeatPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
      });
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          <Link to="/" className="absolute left-0 top-0">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          </Link>
          <CardTitle className="text-2xl font-bold">Habit Tracker</CardTitle>
          <CardDescription>Build better habits, one day at a time</CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-sm text-gray-600 hover:text-gray-800"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-repeat-password">Repeat Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-repeat-password"
                      type={showRepeatPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                      {showRepeatPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {repeatPassword && !doPasswordsMatch && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !isSignUpFormValid}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}