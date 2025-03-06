// src/components/admin/UsersList.tsx
import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { CheckCircle, Unlock, Lock, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TableSkeleton } from "@/utils/SkeletonLoader";
import Pagination from "../layout/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

interface AdminUser {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  role: string;
  isBlocked: boolean;
  joinedDate: string;
  isPremium?: boolean;
}

interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: AdminUsersResponse;
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { theme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchUsers = async (page: number, query: string = "") => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse>(
        "get",
        `/admin/users?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(query)}`
      );
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError("Invalid response structure");
      }
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
      searchInputRef.current?.focus();
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  const handleBlockUnblock = async (userId: string, isBlocked: boolean) => {
    const originalUsers = [...users];
    const endpoint = isBlocked ? `/admin/users/${userId}/unblock` : `/admin/users/${userId}/block`;
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, isBlocked: !isBlocked } : user))
    );
    try {
      const response = await apiRequest<ApiResponse>("post", endpoint);
      if (!response.success) throw new Error("API call failed");
    } catch (err) {
      console.error("Failed to update user status:", err);
      setUsers(originalUsers);
    }
  };

  if (loading) return <TableSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-9 min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Users List</h1>
        <div className="relative w-full sm:w-72">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by username or email..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-background border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-background shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background border-b border-forground">
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Subscription</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y border-gray-600">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`transition-colors cursor-pointer ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground max-w-[100px] truncate">{user.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">{user.userName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground hidden sm:table-cell max-w-[200px] truncate">{user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {user.isPremium ? (
                      <span className="flex items-center gap-1.5 text-yellow-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Premium</span>
                      </span>
                    ) : (
                      <span className="text-primary">Free</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        !user.isBlocked ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockUnblock(user.id, user.isBlocked);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isBlocked ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ListUsers;