export interface Problem {
    _id: string;
    title: string;
    difficulty: string;
    slug: string;
  }
  
  export interface Contest {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    problems: Problem[];
    participants: { _id: string; userName: string }[];
    isActive: boolean;
    isBlocked: boolean;
  }