// src/components/user/ProblemFilter.tsx
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// Define and export the props interface
export interface FilterProps {
  onFilterChange: (filters: { difficulty?: string; status?: string }) => void;
}

const ProblemFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    difficulty: "",
    status: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full p-4 bg-background flex flex-col gap-4">
      {/* <h3 className="text-lg font-semibold text-primary">Filter Problems</h3> */}

      <select
        value={filters.difficulty}
        onChange={(e) => handleFilterChange("difficulty", e.target.value)}
        className={`w-full p-2 border rounded-lg bg-background border-gray-300 dark:border-gray-900 text-foreground ${theme === "dark" ? "text-white" : "text-black"}`}
      >
        <option value="">All Difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        className={`w-full p-2 border rounded-lg bg-background border-gray-300 dark:border-gray-900 text-foreground ${theme === "dark" ? "text-white" : "text-black"}`}
      >
        <option value="">All Statuses</option>
        <option value="SOLVED">Solved</option>
        <option value="NOT_SOLVED">Not Solved</option>
        <option value="PREMIUM">Premium</option>
        <option value="FREE">Free</option>
      </select>
    </div>
  );
};

export default ProblemFilter;