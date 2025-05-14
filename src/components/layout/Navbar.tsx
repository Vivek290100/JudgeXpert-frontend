import { Bell, Code2, ChevronDown, Menu, X } from "lucide-react";
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
import { addNotification, clearNotifications } from "@/redux/slices/notificationSlice";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  console.log("Navbar rendering with notifications:", JSON.stringify(notifications, null, 2));

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isMenuOpen, setIsMenuOpen } = useNavigation();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleTestNotification = () => {
    dispatch(
      addNotification({
        type: "contestStarted",
        contestId: `test-${Date.now()}`, // Ensure unique ID
        title: "Test Contest",
        message: "This is a test notification",
        timestamp: new Date().toISOString(),
      })
    );
    toast.success("Test notification added!", { duration: 5000 });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
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
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link to="/user/problems" className="text-muted-foreground hover:text-foreground">
                  Problems
                </Link>
                <Link to="/user/contests" className="text-muted-foreground hover:text-foreground">
                  Contests
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      Leaderboard
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link to="/user/leaderboard">Global Leaderboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/contests/winners">Contest Leaderboard</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <Button variant="outline" onClick={handleTestNotification}>
                  Test Notification
                </Button> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    {notifications.length === 0 ? (
                      <DropdownMenuItem className="text-muted-foreground">
                        No notifications
                      </DropdownMenuItem>
                    ) : (
                      notifications.map((notification) => (
                        <DropdownMenuItem
                          key={`${notification.contestId}-${notification.timestamp}`}
                          asChild
                          className="flex flex-col items-start py-2"
                        >
                          <Link to={`/user/contests/${notification.contestId}`}>
                            <span className="font-medium">{notification.title}</span>
                            <span className="text-sm text-muted-foreground">{notification.message}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                    {notifications.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => dispatch(clearNotifications())}
                          className="text-sm text-red-500 cursor-pointer"
                        >
                          Clear all notifications
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="relative">
                        <img
                          src={user.profileImage || defaultProfileImage}
                          alt="Profile"
                          className="w-8 h-8 rounded-full border-2 object-cover"
                        />
                        {user.isPremium && (
                          <div className="absolute -top-1 -right-1">
                            <div className="relative">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 animate-pulse blur-sm"></div>
                              <div className="relative bg-yellow-500 text-black rounded-full p-1 flex items-center justify-center w-4 h-4 border-2 border-amber-400 shadow-md">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {user.isPremium && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="bg-yellow-500 text-black rounded-full p-0.5 flex items-center justify-center w-4 h-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-yellow-500">Premium Member</span>
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/user/dashboard">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/subscription">Pricing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {!user && (
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
            {user && (
              <Button variant="outline" onClick={handleTestNotification}>
                Test
              </Button>
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground border border-gray-200 dark:border-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  to="/user/problems"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Problems
                </Link>
                <Link
                  to="/user/contests"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Contests
                </Link>
                <Link
                  to="/user/leaderboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Global Leaderboard
                </Link>
                <Link
                  to="/user/contests/winners"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Contest Leaderboard
                </Link>
                <Link
                  to="/user/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Profile
                </Link>
                <Link
                  to="/user/subscription"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Profile and Logout */}
          {user && (
            <div className="px-5 py-3 border-t">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={user.profileImage || defaultProfileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2"
                  />
                  {user.isPremium && (
                    <div className="absolute -top-1 -right-1">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 animate-pulse blur-sm"></div>
                        <div className="relative bg-yellow-500 text-black rounded-full p-1 flex items-center justify-center w-5 h-5 border-2 border-amber-400 shadow-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{user.fullName}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  {user.isPremium && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="bg-yellow-500 text-black rounded-full p-0.5 flex items-center justify-center w-4 h-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-yellow-500">Premium Member</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;