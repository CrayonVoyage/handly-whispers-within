
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogIn, Hand } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-cream-50 shadow-sm border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center cursor-pointer gap-3" 
            onClick={() => navigate('/')}
          >
            <Hand className="h-8 w-8 text-violet-600" />
            <h1 className="text-2xl font-playfair font-medium text-navy-800">Handly</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-3 text-navy-700 hover:bg-sand-100 rounded-xl px-4 py-2"
                >
                  <Avatar className="h-8 w-8 border-2 border-violet-200">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-violet-100">
                      <User className="h-4 w-4 text-violet-600" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-medium">Mon Profil</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-sand-300 text-navy-700 hover:bg-sand-100 rounded-xl px-4 py-2"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-2 shadow-sm hover:shadow-md transition-all"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
