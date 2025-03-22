import { useTheme } from "@/contexts/ThemeContext";
import { FilterProps } from "@/types/ProblemTypes";



const ProblemFilter: React.FC<FilterProps> = ({ onFilterChange, filters }) => {
  const { theme } = useTheme();

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full p-4 bg-background flex flex-col gap-4">
      <select
        value={filters.difficulty || ""}
        onChange={(e) => handleFilterChange("difficulty", e.target.value)}
        className={`w-full p-2.5 border rounded-lg bg-background border-gray-200 dark:border-gray-700 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        <option value="">All Difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>

      <select
        value={filters.status || ""}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        className={`w-full p-2.5 border rounded-lg bg-background border-gray-200 dark:border-gray-700 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
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