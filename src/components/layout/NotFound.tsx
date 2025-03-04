import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background text-foreground flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card border-border">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 destructive-foreground" />
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-primary">404</h1>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Button onClick={handleGoBack} className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary border border-primary rounded-md">
            <Home className="mr-2 h-4 w-4" />
            Go Back or to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}