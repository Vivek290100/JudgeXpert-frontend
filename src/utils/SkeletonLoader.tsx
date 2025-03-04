// SkeletonLoader.tsx
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
      <Skeleton className="h-[400px]" />
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

// Default export for general loading
const SkeletonLoader = () => (
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