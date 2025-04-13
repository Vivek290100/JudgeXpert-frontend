import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => (
  <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
    {/* Header */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-10 w-[120px]" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-lg border">
          <Skeleton className="h-4 w-[120px] mb-4" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
      ))}
    </div>

    {/* Main Content */}
    <div className="rounded-lg border p-6">
      <Skeleton className="h-[400px] w-full" />
    </div>
  </div>
);

export const ContestsPageSkeleton = () => (
  <div className="container mx-auto px-4 flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between py-4">
      <Skeleton className="h-8 w-[150px]" />
    </div>

    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar (Filters and Statistics) */}
      <div className="w-full lg:w-72 flex-shrink-0 mb-6 lg:mb-0">
        <div className="flex flex-col gap-6">
          {/* Filters Section */}
          <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <Skeleton className="h-6 w-[100px] mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>

          {/* Statistics Section */}
          <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <Skeleton className="h-6 w-[150px] mb-3" />
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center p-2 rounded-lg">
                  <Skeleton className="h-4 w-[60px] mb-2" />
                  <Skeleton className="h-6 w-[40px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (Contest Cards Grid) */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card rounded-lg shadow-md border overflow-hidden"
            >
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-[150px]" />
                  <Skeleton className="h-5 w-[60px] rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="space-y-2 mb-3">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[120px]" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[40px]" />
                    <Skeleton className="h-4 w-[40px]" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="mt-4 mb-6 flex justify-center">
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
    {/* Header and Search */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-[150px]" />
      <Skeleton className="h-10 w-[250px]" />
    </div>

    {/* Table */}
    <div className="rounded-lg border">
      <div className="p-4 space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={j} className="h-8" />
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* Pagination */}
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-8 w-8" />
      ))}
    </div>
  </div>
);

export const AuthSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md space-y-6 p-6 rounded-lg border">
      <Skeleton className="h-8 w-[200px] mx-auto" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export const ProblemDetailsSkeleton = () => (
  <div className="container mx-auto px-4 py-9 min-h-screen bg-background space-y-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-10 w-[300px]" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>

    {/* Basic Info */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>

    {/* Description */}
    <div>
      <Skeleton className="h-6 w-[150px] mb-2" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>

    {/* Default Codes */}
    <div>
      <Skeleton className="h-6 w-[150px] mb-3" />
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>

    {/* Test Cases */}
    <div>
      <Skeleton className="h-6 w-[150px] mb-3" />
      <div className="overflow-x-auto">
        <div className="w-full border rounded-lg">
          <div className="bg-gray-100 dark:bg-gray-900 p-2">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-3 gap-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-8" />
        ))}
      </div>
    </div>
  </div>
);

export const ProblemEditorSkeleton = () => {
  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Description Toggle Skeleton */}
      <div className="lg:hidden border-b border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="p-4 space-y-4 max-h-[30vh] overflow-y-auto">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Description Skeleton */}
        <div className="hidden lg:block lg:w-1/3 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>

        {/* Right Panel: Editor Skeleton */}
        <div className="w-full lg:w-2/3 flex flex-col h-full">
          {/* Editor Header Skeleton */}
          <div className="flex flex-col border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-2">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>

          {/* Test Cases Skeleton */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader = () => (
  <div className="min-h-screen">
    {/* Navbar */}
    <div className="border-b">
      <div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
        <Skeleton className="h-8 w-[150px]" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
      </div>
    </div>

    {/* Content */}
    <DashboardSkeleton />
  </div>
);

export default SkeletonLoader;

export const ContestDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 animate-pulse">
      <div className="h-8 w-1/3 bg-gray-700 rounded mb-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <div className="h-6 w-1/2 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 w-full bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <div className="h-6 w-1/2 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-md p-4 border border-border mb-6">
            <div className="h-6 w-1/3 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-700 rounded mb-1"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <div className="h-6 w-1/3 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
