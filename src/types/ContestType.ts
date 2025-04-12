export interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  problems: { _id: string; title: string; difficulty: string; slug: string }[];
  participants: { _id: string; userName: string }[];
  isActive: boolean;
  isBlocked: boolean;
}