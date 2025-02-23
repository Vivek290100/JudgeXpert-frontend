import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '@/utils/axios/ApiRequest';
import {
  CheckCircle, Unlock, Lock, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTheme } from "@/contexts/ThemeContext";


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
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const { theme,  } = useTheme();


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse>(
        'get',
        `/admin/users?page=${currentPage}&limit=${itemsPerPage}`
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
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleBlockUnblock = async (userId: string, isBlocked: boolean) => {
    try {
      const endpoint = isBlocked ? `/admin/users/${userId}/unblock` : `/admin/users/${userId}/block`;
      const response = await apiRequest<ApiResponse>(
        'post',
        endpoint
      );
      
      if (response.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, isBlocked: !isBlocked } : user
          )
        );
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to update user status");
    }
  };

  const handleRowClick = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const renderPaginationButtons = () => {
    let buttons = [];
    const maxVisibleButtons = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            currentPage === i
              ? theme === 'dark'
                ? 'bg-gray-600 text-white border-gray-600'
                : 'bg-gray-300 text-black border-gray-300'
              : theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-200 border-gray-600'
                : 'hover:bg-gray-200 text-gray-900 border-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-9  min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Users List</h1>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user.id)}
                  // className="hover:bg-gray-800 transition-colors cursor-pointer"
                  className={`transition-colors cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                  }`}
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground max-w-[100px] truncate">
                    {user.id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">
                    {user.userName}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground hidden sm:table-cell max-w-[200px] truncate">
                    {user.email}
                  </td>
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
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      !user.isBlocked 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockUnblock(user.id, user.isBlocked);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isBlocked 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
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

      <div className="mt-6 flex justify-center items-center gap-2">
  <button
    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
    disabled={currentPage === 1}
    className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border transition-colors ${
      theme === 'dark'
        ? 'hover:bg-gray-700 border-gray-600'
        : 'hover:bg-gray-200 border-gray-200'
    }`}
  >
    <ChevronLeft className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`} />
  </button>
  {renderPaginationButtons()}
  <button
    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
    disabled={currentPage === totalPages}
    className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border transition-colors ${
      theme === 'dark'
        ? 'hover:bg-gray-700 border-gray-600'
        : 'hover:bg-gray-200 border-gray-200'
    }`}
  >
    <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`} />
  </button>
</div>
    </div>
  );
};

export default ListUsers;