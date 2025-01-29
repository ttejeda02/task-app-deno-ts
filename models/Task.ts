export interface Task {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  status: "pending" | "ongoing" | "completed" | "archived";
  id_user: number | null;
  priority: "low" | "medium" | "high";
}
