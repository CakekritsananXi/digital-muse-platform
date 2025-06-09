
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { UserCredits } from "@/components/UserCredits";

export const PremiumHeader = () => {
  const { user, signOut } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gold-500/20">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="w-8 h-8 text-gold-400" />
            <span className="text-2xl font-playfair font-bold gradient-text">Lovable Studio</span>
            <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Pro</Badge>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('studio')}
              className="text-foreground/70 hover:text-gold-400 transition-colors font-medium"
            >
              Studio
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-foreground/70 hover:text-gold-400 transition-colors font-medium"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('styles')}
              className="text-foreground/70 hover:text-gold-400 transition-colors font-medium"
            >
              Styles
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-foreground/70 hover:text-gold-400 transition-colors font-medium"
            >
              Features
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <UserCredits />
            
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gold-400" />
                  <span className="text-foreground/70">{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
