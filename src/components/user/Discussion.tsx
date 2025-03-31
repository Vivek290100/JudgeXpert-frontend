import React, { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

interface DiscussionProps {
  problemId: string;
  problemTitle: string;
}

interface Message {
  user: { userName: string };
  message: string;
  createdAt: string;
}

const Discussion: React.FC<DiscussionProps> = ({ problemId, problemTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [discussions, setDiscussions] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentUser = useSelector((state: RootState) => state.auth.user?.userName);

  useEffect(() => {
    if (isOpen) {
      fetchDiscussions();
    }
  }, [isOpen, page]);

  const fetchDiscussions = async () => {
    try {
      const response = await apiRequest<any>(
        "get",
        `/discussions/${problemId}?page=${page}&limit=10`
      );

      if (response.success) {
        const sortedMessages = response.data.discussions
          .map((d: any) => ({
            user: { userName: d.userId.userName },
            message: d.message,
            createdAt: new Date(d.createdAt).toISOString(),
          }))
          .sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        setDiscussions(sortedMessages);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error("Failed to fetch discussions");
      console.error("Fetch discussions error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await apiRequest<any>("post", "/discussions", {
        problemId,
        message,
      });

      if (response.success) {
        setMessage("");
        fetchDiscussions();
      }
    } catch (error) {
      toast.error("Failed to post discussion");
      console.error("Post discussion error:", error);
    }
  };

  return (
    <div className="w-full max-w-full">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          <MessageSquare className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium truncate">Discussion</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 md:static md:max-w-md md:mx-auto bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-lg font-semibold text-primary truncate">
              Discussion - {problemTitle}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {discussions.map((msg, index) => {
              const isSender = msg.user.userName === currentUser;
              return (
                <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      isSender
                        ? "bg-gray-700 text-white"
                        : "bg-gray-700 dark:bg-gray-700 text-white dark:text-white"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 resize-none h-20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors sm:self-end sm:w-auto w-full"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Discussion;