// src/components/user/UserDashboard.tsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import EditProfile from "./EditProfile";

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  console.log("Dashboard User State:", user);

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-background text-foreground min-h-[calc(100vh-100px)] flex items-center justify-center">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto p-4">
        {/* Profile Section */}
        <div className="bg-card text-card-foreground rounded-lg border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 flex flex-col items-center relative">
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mb-2 relative overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">{user.fullName.charAt(0)}</span>
              )}
            </div>
            <h3 className="text-lg font-medium">Profile</h3>
          </div>
          <div className="border-t p-4 space-y-2">
            <button
              className="w-full py-2 text-primary bg-secondary hover:bg-muted rounded-lg transition"
              onClick={() => setIsEditProfileOpen(true)}
            >
              Edit Profile
            </button>
            <button className="w-full py-2 text-primary bg-secondary hover:bg-muted rounded-lg transition">
              Change Password
            </button>
            <button className="w-full py-2 text-primary bg-secondary hover:bg-muted rounded-lg transition">
              Forgot Password
            </button>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Info Section */}
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-2">{user.fullName}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-4 space-y-3">
              {user.github ? (
                <a
                  href={user.github}
                  className="text-sm hover:underline flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                    <FaGithub className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-primary">GitHub</span>
                </a>
              ) : (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    <FaGithub className="w-5 h-5 text-gray-500" />
                  </div>
                  <span>GitHub: Not linked</span>
                </div>
              )}

              {user.linkedin ? (
                <a
                  href={user.linkedin}
                  className="text-sm hover:underline flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <FaLinkedin className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-primary">LinkedIn</span>
                </a>
              ) : (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                    <FaLinkedin className="w-5 h-5 text-gray-500" />
                  </div>
                  <span>LinkedIn: Not linked</span>
                </div>
              )}
            </div>
          </div>

          {/* Rank Section */}
          <div className="bg-card text-card-foreground rounded-lg border p-6 text-center">
            <h3 className="font-medium mb-4">My Rank</h3>
            <div className="text-4xl font-bold">#{user.rank || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">Level Up!</p>
            <button className="w-full mt-4 bg-secondary text-primary py-2 rounded-md">
              Leader Board
            </button>
          </div>

          {/* Contests Section */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-10 text-card-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-.118l-3.976-2.888c-.784-.57-.38-1.81.588-.181h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <h3 className="text-card-foreground font-medium">Contests</h3>
              </div>
              <button className="bg-secondary text-secondary-foreground text-xs px-2 py-2 rounded-md hover:bg-accent">
                Participate
              </button>
            </div>

            <div className="text-sm text-card-foreground mb-4">
              <p>Code. Compete. Win! ✨</p>
              <p className="text-muted-foreground mt-1">
                Participate in exciting coding battles!
              </p>
            </div>

            <button className="w-full mt-12 bg-secondary text-primary py-2 my-6 rounded-md">
              Contest Winners
            </button>
          </div>

          {/* Acceptance Section */}
          <div className="bg-card text-card-foreground rounded-lg border p-8">
            <h1 className="font-medium mb-5">Problems Solved</h1>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {user.problemsSolved ?? 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Solved</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm capitalize">Progress</span>
                  <span className="bg-muted text-primary px-3 py-1 rounded-md text-xs">
                    {user.problemsSolved ? `${user.problemsSolved} solved` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 bg-secondary text-primary py-2 rounded-md">
              Solved Problems
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;