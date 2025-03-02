// src/components/Admin/AdminDashboard.tsx
import { Download, Search } from "lucide-react";
import { useState } from "react";

interface StatCardProps {
  title: string;
  value: string;
  label: string;
  color: string;
}

const StatCard = ({ title, value, label, color }: StatCardProps) => (
  <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border border-border">
    <div className={`text-${color} text-sm sm:text-base mb-2`}>{title}</div>
    <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
  </div>
);

interface ProblemRowProps {
  number: string;
  title: string;
  submissions: string;
  submissionColor: string;
}

const ProblemRow = ({ number, title, submissions, submissionColor }: ProblemRowProps) => (
  <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="text-muted-foreground text-xs sm:text-sm md:text-base">#{number}</span>
      <span className="text-foreground text-xs sm:text-sm md:text-base truncate max-w-[100px] sm:max-w-[150px] md:max-w-full">{title}</span>
    </div>
    <span className={`text-${submissionColor} bg-${submissionColor}/20 px-2 py-1 text-xs sm:text-sm rounded-full`}>
      {submissions}
    </span>
  </div>
);

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full bg-background text-foreground p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-14">
        <div className="relative w-full sm:w-[300px]">
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card text-foreground pl-8 pr-3 py-2 text-sm rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent border border-border"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 text-sm rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto">
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </button>
      </div>

      <h2 className="text-foreground text-lg sm:text-xl mb-4 sm:mb-6">Sales Summary</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value="12k" label="Total Users" color="[#a5f3fc]" />
        <StatCard title="Subscribers" value="5k" label="Subscribers" color="orange-400" />
        <StatCard title="Total Problems" value="500" label="Total Problems" color="purple-400" />
        <StatCard title="Total Contests" value="09" label="Total Contests" color="pink-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border border-border">
          <h3 className="text-foreground text-base sm:text-lg mb-3 sm:mb-4">Top Submitted Problems</h3>
          <div className="space-y-2">
            <ProblemRow number="01" title="Find Lucky Integer in an Array" submissions="2334" submissionColor="orange-400" />
            <ProblemRow number="02" title="String Matching in an Array" submissions="2323" submissionColor="green-400" />
            <ProblemRow number="03" title="Count Odd Numbers in an Interval Range" submissions="1943" submissionColor="blue-400" />
            <ProblemRow number="04" title="Kth Missing Positive Number" submissions="456" submissionColor="purple-400" />
          </div>
        </div>

        <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border border-border">
          <h3 className="text-foreground text-base sm:text-lg mb-3 sm:mb-4">Customer Fulfillment</h3>
          <div className="h-[150px] sm:h-[180px] md:h-[200px] flex items-end justify-between gap-1 px-1 sm:px-2">
            {[
              { height: '80%', value: '80%' },
              { height: '60%', value: '60%' },
              { height: '90%', value: '90%' },
              { height: '70%', value: '70%' },
              { height: '85%', value: '85%' },
              { height: '75%', value: '75%' },
            ].map((bar, index) => (
              <div key={index} className="flex-1 bg-accent bg-opacity-20 rounded-t-lg relative group" style={{ height: bar.height }}>
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-card text-accent text-xs px-1 sm:px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1 sm:px-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>
    </div>
  );
}