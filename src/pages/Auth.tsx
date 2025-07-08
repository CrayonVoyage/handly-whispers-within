
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mode') !== 'signup';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  
  const { signIn, signUp, user, checkUsernameAvailable } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const checkUsername = async (usernameValue: string) => {
    if (!usernameValue || usernameValue.length < 3) {
      setUsernameError('Username must contain at least 3 characters');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(usernameValue)) {
      setUsernameError('Username can only contain letters, numbers and underscores');
      return false;
    }

    const isAvailable = await checkUsernameAvailable(usernameValue);
    if (!isAvailable) {
      setUsernameError('This username is already taken');
      return false;
    }

    setUsernameError('');
    return true;
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    if (value && !isLogin) {
      await checkUsername(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Validate username before signup
        const isUsernameValid = await checkUsername(username);
        if (!isUsernameValid) {
          setLoading(false);
          return;
        }
        
        result = await signUp(email, password, fullName, username);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else if (!isLogin) {
        toast({
          title: "Registration successful!",
          description: "Check your email to confirm your account."
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md bg-card shadow-lg border-sand-200 rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <Hand className="h-16 w-16 text-violet-600" />
          </div>
          <CardTitle className="text-3xl font-playfair font-medium text-navy-800">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </CardTitle>
          <CardDescription className="text-navy-600 text-base mt-2">
            {isLogin 
              ? 'Sign in to your Handly account' 
              : 'Create your Handly account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-3">
                  <label htmlFor="fullName" className="text-base font-medium text-navy-700">
                    Full name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    placeholder="Your full name"
                    className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
                  />
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="username" className="text-base font-medium text-navy-700">
                    Username *
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    required={!isLogin}
                    placeholder="username"
                    className={`bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base ${usernameError ? 'border-red-500' : ''}`}
                  />
                  {usernameError && (
                    <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                  )}
                </div>
              </>
            )}
            
            <div className="space-y-3">
              <label htmlFor="email" className="text-base font-medium text-navy-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="password" className="text-base font-medium text-navy-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-navy-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <label htmlFor="confirmPassword" className="text-base font-medium text-navy-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  placeholder="••••••••"
                  className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-4 text-base font-medium shadow-sm hover:shadow-md transition-all" 
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-base text-violet-600 hover:text-violet-800 font-medium"
            >
              {isLogin 
                ? 'No account yet? Sign up' 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
