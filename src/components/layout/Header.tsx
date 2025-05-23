
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const { user, isAdmin, isPatient } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      // SignOut function handles the redirect
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <span className="sr-only">Menu</span>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col space-y-4 mt-8">
          <Link 
            to="/" 
            className="text-lg font-medium" 
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          
          {!user && (
            <>
              <Link 
                to="/auth/signin" 
                className="text-lg font-medium" 
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/auth/signup" 
                className="text-lg font-medium" 
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
          
          {isPatient && (
            <>
              <Link 
                to="/patient/book" 
                className="text-lg font-medium" 
                onClick={() => setIsOpen(false)}
              >
                Book Appointment
              </Link>
              <Link 
                to="/patient/appointments" 
                className="text-lg font-medium" 
                onClick={() => setIsOpen(false)}
              >
                My Appointments
              </Link>
            </>
          )}
          
          {isAdmin && (
            <>
              <Link 
                to="/admin/dashboard" 
                className="text-lg font-medium" 
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/availability" 
                className="text-lg font-medium" 
                onClick={() => setIsOpen(false)}
              >
                Manage Availability
              </Link>
              <Link 
                to="/admin/appointments" 
                className="text-lg font-medium" 
                onClick={() => setIsOpen(false)}
              >
                Manage Appointments
              </Link>
            </>
          )}
          
          {user && (
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              DB
            </div>
            <span className="text-xl font-semibold text-gray-800">
              DocBook
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {!user && (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/auth/signin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link to="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
          
          {user && (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              {isPatient && (
                <>
                  <Link to="/patient/book" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Book Appointment
                  </Link>
                  <Link to="/patient/appointments" className="text-gray-700 hover:text-blue-600 transition-colors">
                    My Appointments
                  </Link>
                </>
              )}
              
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/admin/availability" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Manage Availability
                  </Link>
                  <Link to="/admin/appointments" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Manage Appointments
                  </Link>
                </>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {user.full_name || user.email}
                </span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            </>
          )}
        </nav>
        
        {/* Mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
}

export default Header;
