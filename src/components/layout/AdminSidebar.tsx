import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  Code2,
  Trophy,
  CreditCard,
  LogOut,
  ChevronLeft,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/thunks/AuthThunks";
import toast from "react-hot-toast";
import { AppDispatch } from "@/redux/Store";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(!isMobile); // Default to closed on mobile

  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admin/dashboard" },
    { title: "Users", icon: <Users className="w-5 h-5" />, path: "/admin/users" },
    { title: "Problems", icon: <Code2 className="w-5 h-5" />, path: "#" },
    { title: "Contests", icon: <Trophy className="w-5 h-5" />, path: "" },
    { title: "Subscription", icon: <CreditCard className="w-5 h-5" />, path: "" },
  ];

  const getCurrentPath = () => {
    const path = location.pathname;
    const item = sidebarItems.find(
      (item) => path === item.path || (item.path !== "/admin" && path.startsWith(item.path))
    );
    return item?.title || "Dashboard";
  };

  const [activeItem, setActiveItem] = useState(getCurrentPath());

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    setActiveItem(getCurrentPath());
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // Auto-open on desktop, close on mobile
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (item: SidebarItem) => {
    setActiveItem(item.title);
    navigate(item.path);
    if (isMobile) toggleSidebar();
  };

  const handleSignOut = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-accent text-accent-foreground rounded-lg md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      <div
        className={`
          fixed md:static z-40 transition-all duration-300 flex flex-col h-screen
          ${isOpen ? "w-64" : "w-16 md:w-20"}
          ${isMobile ? (isOpen ? "left-0" : "-left-64") : "left-0"}
          ${theme === "dark" ? "bg-background border-gray-800 text-gray-200" : "bg-white border-gray-200 text-gray-900"}
          border-r
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
          {isOpen ? (
            <>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                  Judge
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${
                      theme === "dark" ? "from-yellow-400 to-red-500" : "from-primary to-blue-500"
                    } shine-effect`}
                  >
                    X
                  </span>
                  pert
                </span>
              </div>
              <button
                onClick={toggleSidebar}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="w-full flex justify-center text-primary hover:text-foreground transition-colors"
            >
              <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          )}
        </div>

        {/* Sidebar Items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.title}
              onClick={() => handleNavigation(item)}
              className={`
                w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base
                ${!isOpen ? "justify-center" : ""}
                ${
                  activeItem === item.title
                    ? theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-black"
                    : theme === "dark"
                    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }
              `}
              title={!isOpen ? item.title : undefined}
            >
              {item.icon}
              {isOpen && <span>{item.title}</span>}
            </button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="p-3 sm:p-4 border-t border-border">
          <button
            onClick={toggleTheme}
            className={`px-2 sm:px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-black hover:bg-gray-200'
            }`}          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isOpen && (theme === "dark" ? "Light Mode" : "Dark Mode")}
          </button>
        </div>

        {/* Sign Out Button */}
  <div className={`p-3 sm:p-4 border-t ${
    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  }`}>
    <button
      onClick={handleSignOut}
      className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
        !isOpen ? "justify-center" : ""
      } ${
        theme === 'dark'
          ? 'text-gray-200 hover:bg-gray-700'
          : 'text-gray-900 hover:bg-gray-200'
      }`}
      title={!isOpen ? "Sign out" : undefined}
    >
      <LogOut className="w-5 h-5" />
      {isOpen && <span>Sign out</span>}
    </button>
  </div>
      </div>
    </>
  );
}