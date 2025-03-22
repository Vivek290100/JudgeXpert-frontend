export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index?: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  rowClassName?: string;
}