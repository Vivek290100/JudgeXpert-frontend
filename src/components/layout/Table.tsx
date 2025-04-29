import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { TableProps } from "@/types/ComponentsTypes";



const Table = <T,>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data available",
  rowClassName = "",
}: TableProps<T>) => {
  const { theme } = useTheme();

  return (
    <div className="overflow-x-auto rounded-lg dark:border-gray-700 shadow-sm ">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
              key={column.key}
              className={`px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider ${column.className || ""}`}
            >
            
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-gray-200 dark:divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`transition-colors ${onRowClick ? "" : ""} ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                } ${rowClassName}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                  {column.render
                      ? column.render(item, index)
                      : (item[column.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;