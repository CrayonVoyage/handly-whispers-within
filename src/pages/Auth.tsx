
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      navigate('/');
    }
  }, [user, navigate]);

  const checkUsername = async (usernameValue: string) => {
    if (!usernameValue || usernameValue.length < 3) {
      setUsernameError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(usernameValue)) {
      setUsernameError('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores');
      return false;
    }

    const isAvailable = await checkUsernameAvailable(usernameValue);
    if (!isAvailable) {
      setUsernameError('Ce nom d\'utilisateur est déjà pris');
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
          title: "Erreur",
          description: result.error.message,
          variant: "destructive"
        });
      } else if (!isLogin) {
        toast({
          title: "Inscription réussie!",
          description: "Vérifiez votre email pour confirmer votre compte."
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
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
            {isLogin ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <CardDescription className="text-navy-600 text-base mt-2">
            {isLogin 
              ? 'Connectez-vous à votre compte Handly' 
              : 'Créez votre compte Handly'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-3">
                  <label htmlFor="fullName" className="text-base font-medium text-navy-700">
                    Nom complet
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    placeholder="Votre nom complet"
                    className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
                  />
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="username" className="text-base font-medium text-navy-700">
                    Nom d'utilisateur *
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    required={!isLogin}
                    placeholder="nom_utilisateur"
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
                placeholder="votre@email.com"
                className="bg-white border-sand-300 focus:border-violet-400 focus:ring-violet-400 rounded-xl py-3 px-4 text-base"
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="password" className="text-base font-medium text-navy-700">
                Mot de passe
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
            
            <Button 
              type="submit" 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-4 text-base font-medium shadow-sm hover:shadow-md transition-all" 
              disabled={loading}
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-base text-violet-600 hover:text-violet-800 font-medium"
            >
              {isLogin 
                ? 'Pas encore de compte ? Inscrivez-vous' 
                : 'Déjà un compte ? Connectez-vous'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
