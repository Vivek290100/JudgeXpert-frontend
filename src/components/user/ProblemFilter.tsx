import { useTheme } from "@/contexts/ThemeContext";
import { Difficulty, Status } from "@/types/Enums";

interface UpdatedFilterProps {
  onFilterChange: (filters: { difficulty?: Difficulty; status?: Status }) => void;
  filters: { difficulty?: Difficulty; status?: Status };
}

const ProblemFilter: React.FC<UpdatedFilterProps> = ({ onFilterChange, filters }) => {
  const { theme } = useTheme();

  const handleFilterChange = (key: keyof UpdatedFilterProps["filters"], value: Difficulty | Status) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full p-4 bg-background flex flex-col gap-4">
      <select
        value={filters.difficulty || ""}
        onChange={(e) => handleFilterChange("difficulty", e.target.value as Difficulty)}
        className={`w-full p-2.5 border rounded-lg bg-background border-gray-200 dark:border-gray-700 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        <option value="">All Difficulties</option>
        {Object.values(Difficulty).map((difficulty) => (
          <option key={difficulty} value={difficulty}>
            {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
          </option>
        ))}
      </select>

      <select
        value={filters.status || ""}
        onChange={(e) => handleFilterChange("status", e.target.value as Status)}
        className={`w-full p-2.5 border rounded-lg bg-background border-gray-200 dark:border-gray-700 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        <option value="">All Statuses</option>
        {Object.values(Status).map((status) => (
          <option key={status} value={status}>
            {status
              .split("_")
              .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
              .join(" ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProblemFilter;