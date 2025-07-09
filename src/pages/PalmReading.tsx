import HandlyForm from "@/components/HandlyForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hand } from "lucide-react";

const PalmReading = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hand className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-playfair font-medium text-foreground mb-6">
            Handly
          </h1>
          <h2 className="text-2xl font-playfair text-foreground mb-6">
            Palm Reading
          </h2>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <ErrorBoundary>
          <HandlyForm />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default PalmReading;