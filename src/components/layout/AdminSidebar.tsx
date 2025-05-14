import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Users, LayoutDashboard, Code2, Trophy, LogOut, ChevronLeft, Menu, Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/thunks/AuthThunks";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "@/redux/Store";
import { SidebarItem } from "@/types/ComponentsTypes";
import AddNewProblemModal from "../admin/AddNewProblemModal";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { theme, toggleTheme } = useTheme();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);

  // Filter newProblem notifications
  const newProblems = notifications
    .filter((n) => n.type === "newProblem" && n.slug)
    .map((n) => n.slug!);

  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admin/dashboard" },
    { title: "Users", icon: <Users className="w-5 h-5" />, path: "/admin/users" },
    {
      title: "Problems",
      icon: <Code2 className="w-5 h-5" />,
      path: "/admin/problems",
    },
    { title: "Contests", icon: <Trophy className="w-5 h-5" />, path: "/admin/contests" },
    ...(newProblems.length > 0
      ? [
          {
            title: "Add New Problem",
            icon: <Plus className="w-5 h-5" />,
            path: "#",
            onClick: () => setIsAddProblemModalOpen(true),
            notificationCount: newProblems.length,
          },
        ]
      : []),
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
      setIsOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (item: SidebarItem) => {
    setActiveItem(item.title);
    if (item.onClick) {
      item.onClick();
    } else {
      navigate(item.path);
    }
    if (isMobile) toggleSidebar();
  };

  const handleSignOut = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  const handleProblemProcessed = (slug: string) => {
    // Optionally dispatch an action to remove the notification from Redux
    // For now, just update the UI
    toast.dismiss(`new-problem-${slug}`);
  };

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-accent text-accent-foreground rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open sidebar"
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
        aria-hidden={isMobile && !isOpen}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
          {isOpen ? (
            <>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 sm:w-6 h-5 sm:h-6 text-primary" aria-hidden="true" />
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue

-500 to-blue-800 bg-clip-text text-transparent">
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
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="w-full flex justify-center text-primary hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto" aria-label="Sidebar navigation">
          {sidebarItems.map((item) => (
            <button
              key={item.title}
              onClick={() => handleNavigation(item)}
              className={`
                w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-4 rounded-lg transition-colors text-sm sm:text-base relative
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
              aria-current={activeItem === item.title ? "page" : undefined}
              aria-label={`Navigate to ${item.title}`}
            >
              {item.icon}
              {isOpen && <span>{item.title}</span>}
              {isOpen && item.notificationCount ? (
                <span
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label={`${item.notificationCount} new problems`}
                >
                  {item.notificationCount}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-3 sm:p-4 border-t border-border">
          <button
            onClick={toggleTheme}
            className={`px-2 sm:px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base ${
              theme === "dark"
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-black hover:bg-gray-200"
            }`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isOpen && (theme === "dark" ? "Light Mode" : "Dark Mode")}
          </button>
        </div>

        <div className={`p-3 sm:p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              !isOpen ? "justify-center" : ""
            } ${
              theme === "dark"
                ? "text-gray-200 hover:bg-gray-700"
                : "text-gray-900 hover:bg-gray-200"
            }`}
            title={!isOpen ? "Sign out" : undefined}
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Sign out</span>}
          </button>
        </div>
      </div>

      {isAddProblemModalOpen && (
        <AddNewProblemModal
          isOpen={isAddProblemModalOpen}
          onClose={() => setIsAddProblemModalOpen(false)}
          newProblems={newProblems}
          onProblemProcessed={handleProblemProcessed}
        />
      )}
    </>
  );
}