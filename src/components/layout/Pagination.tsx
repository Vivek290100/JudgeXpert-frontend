// src/components/layout/Pagination.tsx
import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { PaginationProps } from "@/types/Pagination";



const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisibleButtons = 5,
}) => {
  const { theme } = useTheme();

  const renderPaginationButtons = () => {
    const buttons = [];
    const adjustedMaxButtons = window.innerWidth < 640 ? Math.min(3, maxVisibleButtons) : maxVisibleButtons;
    let startPage = Math.max(1, currentPage - Math.floor(adjustedMaxButtons / 2));
    let endPage = Math.min(totalPages, startPage + adjustedMaxButtons - 1);

    if (endPage - startPage + 1 < adjustedMaxButtons) {
      startPage = Math.max(1, endPage - adjustedMaxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            currentPage === i
              ? theme === "dark"
                ? "bg-gray-600 text-white border-gray-600"
                : "bg-gray-300 text-black border-gray-300"
              : theme === "dark"
              ? "hover:bg-gray-700 text-gray-200 border-gray-600"
              : "hover:bg-gray-200 text-gray-900 border-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border transition-colors ${
          theme === "dark" ? "hover:bg-gray-700 border-gray-600" : "hover:bg-gray-200 border-gray-200"
        }`}
      >
        <ChevronLeft className={`w-4 h-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`} />
      </button>
      {renderPaginationButtons()}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border transition-colors ${
          theme === "dark" ? "hover:bg-gray-700 border-gray-600" : "hover:bg-gray-200 border-gray-200"
        }`}
      >
        <ChevronRight className={`w-4 h-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`} />
      </button>
    </div>
  );
};

export default Pagination