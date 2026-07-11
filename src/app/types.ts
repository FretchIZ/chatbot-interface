export type AuthUser = { name: string; email: string; avatar: string; provider: "google" | "facebook" | "email" };
export type Message = { id: number; role: "user" | "assistant"; content: string };
export type Model = { name: string; desc: string; badge: string };
export type Suggestion = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  desc: string;
  prompt: string;
  color: string;
  border: string;
  iconColor: string;
};
export type HistoryGroup = {
  label: string;
  items: { id: number; title: string; icon: React.ComponentType<{ size?: number }> }[];
};
