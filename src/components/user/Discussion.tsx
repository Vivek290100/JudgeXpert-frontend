import React, { useEffect, useState } from "react";
import { MessageSquare, X, Reply, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

interface DiscussionProps {
  problemId: string;
  problemTitle: string;
}

interface Reply {
  user: { userName: string };
  message: string;
  createdAt: string;
}

interface Message {
  _id: string;
  user: { userName: string };
  message: string;
  createdAt: string;
  replies: Reply[];
}

const Discussion: React.FC<DiscussionProps> = ({ problemId, problemTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState<{ [key: string]: string }>({});
  const [discussions, setDiscussions] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});

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
            _id: d._id,
            user: { userName: d.userId.userName },
            message: d.message,
            createdAt: new Date(d.createdAt).toISOString(),
            replies: d.replies.map((r: any) => ({
              user: { userName: r.userId.userName },
              message: r.message,
              createdAt: new Date(r.createdAt).toISOString(),
            })),
          }))
          .sort((a: { createdAt: string }, b: { createdAt: string }) =>
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

  const handleReplySubmit = async (discussionId: string, e: React.FormEvent) => {
    e.preventDefault();
    const replyText = replyMessage[discussionId];
    if (!replyText?.trim()) return;

    try {
      const response = await apiRequest<any>("post", "/discussions/reply", {
        discussionId,
        message: replyText,
      });

      if (response.success) {
        setReplyMessage((prev) => ({ ...prev, [discussionId]: "" }));
        setShowReplyForm((prev) => ({ ...prev, [discussionId]: false }));
        setShowReplies((prev) => ({ ...prev, [discussionId]: true }));
        fetchDiscussions();
      }
    } catch (error) {
      toast.error("Failed to post reply");
      console.error("Post reply error:", error);
    }
  };

  const toggleReplies = (discussionId: string) => {
    setShowReplies((prev) => ({ ...prev, [discussionId]: !prev[discussionId] }));
  };

  const toggleReplyForm = (discussionId: string) => {
    setShowReplyForm((prev) => ({ ...prev, [discussionId]: !prev[discussionId] }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " · " + date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full max-w-full py-1">
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
        <div className="fixed inset-0 md:static md:h-[70vh] md:max-w-2xl md:mx-auto lg:h-full lg:max-h-[90vh] bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
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

          {/* Messages Section */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 md:h-[50vh] lg:h-[40vh]">
            {discussions.map((msg) => {
              const isSender = msg.user.userName === currentUser;
              const hasReplies = msg.replies.length > 0;

              return (
                <div key={msg._id} className="space-y-2">
                  {/* Main Comment */}
                  <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`w-full max-w-[80%] p-3 rounded-lg shadow-md ${isSender
                        ? "bg-gray-700 text-white border border-gray-600"
                        : "bg-gray-200 dark:bg-gray-600 text-black dark:text-white border border-gray-400 dark:border-gray-500"
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-400 dark:text-gray-300 mb-1">
                        {msg.user.userName === currentUser ? `${msg.user.userName} (you)` : msg.user.userName}
                      </div>
                      <div className="text-sm break-words mb-2">{msg.message}</div>
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-300">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(msg.createdAt)}
                        </span>
                        <button
                          onClick={() => toggleReplyForm(msg._id)}
                          className="flex items-center hover:text-gray-200"
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Replies Toggle */}
                  {hasReplies && (
                    <div className="ml-4">
                      <button
                        onClick={() => toggleReplies(msg._id)}
                        className="text-xs text-gray-600 dark:text-gray-300 hover:underline flex items-center gap-1"
                      >
                        {showReplies[msg._id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        {msg.replies.length} {msg.replies.length === 1 ? "Reply" : "Replies"}
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {showReplies[msg._id] && hasReplies && (
                    <div className="ml-8 space-y-2">
                      {msg.replies.map((reply, index) => {
                        const isReplySender = reply.user.userName === currentUser;
                        return (
                          <div key={index} className="flex justify-start">
                            <div
                              className={`w-full max-w-[75%] p-2 rounded-lg shadow ${isReplySender
                                ? "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 border border-blue-300 dark:border-blue-600"
                                : "bg-gray-100 dark:bg-gray-600 text-black dark:text-white border border-gray-300 dark:border-gray-500"
                              }`}
                            >
                              <div className="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
                                {reply.user.userName === currentUser ? `${reply.user.userName} (you)` : reply.user.userName}
                              </div>
                              <div className="text-sm break-words mb-1">{reply.message}</div>
                              <div className="flex justify-end text-xs text-gray-400 dark:text-gray-300">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDate(reply.createdAt)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply Form */}
                  {showReplyForm[msg._id] && (
                    <div className="ml-8">
                      <form
                        onSubmit={(e) => handleReplySubmit(msg._id, e)}
                        className="flex gap-2"
                      >
                        <textarea
                          value={replyMessage[msg._id] || ""}
                          onChange={(e) =>
                            setReplyMessage((prev) => ({ ...prev, [msg._id]: e.target.value }))
                          }
                          placeholder="Write a reply..."
                          className="flex-1 p-2 border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 resize-none h-12"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Main Comment Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg bg-background text-foreground text-sm focus:outline-none dark:border-gray-700 resize-none h-20"
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