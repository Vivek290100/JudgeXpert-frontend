import { Code2, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppDispatch, RootState } from "@/redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/thunks/AuthThunks";
import { useNavigation } from "@/contexts/Nvigation-context";
import defaultProfileImage from "@/assets/navbar/defaultProfile.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("=====================",user?.role);
  
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { isMenuOpen, setIsMenuOpen } = useNavigation();

  const handleLogout = async () => {
    console.log("its logout handle function");
    
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully!")
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show error message to user
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Code2 className="w-7 h-7 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
              Judge
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 dark:from-yellow-400 dark:to-red-500 shine-effect">
                X
              </span>
              pert
            </span>
          </div>

          {/* <style>{`
            .shine-effect { position: relative; animation: shine 3s infinite; .
           text-shadow: 0 0 3px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.5), 0 0 9px rgba(255, 255, 255, 0.4); }
            @keyframes shine {0% {text-shadow: 0 0 3px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.5), 0 0 9px rgba(255, 255, 255, 0.4);}
              50% {text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.5); }
              100% {text-shadow: 0 0 3px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.5), 0 0 9px rgba(255, 255, 255, 0.4); }
            }
          `}</style> */}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/problems"
              className="text-muted-foreground hover:text-foreground"
            >
              Problems
            </Link>
            <Link
              to="/pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>

            {/* Conditional rendering based on whether the user is logged in */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <img
                      src={user.profileImage || defaultProfileImage} // Default image if user doesn't have one
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2"
                    />
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/user/Dashboard">Your Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/problems">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // If no user is logged in, show "Sign in" and "Sign up"
              <div className="flex items-center gap-4">
                <Button asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle mobile menu visibility
              className="text-foreground"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/problems"
              className="block px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              Problems
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
          </div>
          {user ? (
            <div className="px-5 py-3 border-t">
              <div className="flex items-center">
                <img
                  src={user.profileImage || defaultProfileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium">{user.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start text-sm"
                >
                  <Link to="/profile">Your Profile</Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start text-sm"
                >
                  <Link to="/settings">Settings</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={handleLogout}
                >
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-5 py-3 border-t space-y-2">
              <Button variant="ghost" asChild className="w-full">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
