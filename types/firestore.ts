import { Timestamp, FieldValue } from "firebase/firestore";

/**
 * Represents the core user profile information.
 * Stored in /users/{userId}
 */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  hasCompletedOnboarding: boolean;
}

/**
 * Represents a high-level goal for a user.
 * Stored as an array in a user's document.
 */
export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: "not-started" | "in-progress" | "completed";
  createdAt: Timestamp;
}

/**
 * Represents a specific, actionable task, optionally linked to a Goal.
 * Stored as an array in a user's document.
 */
export interface Task {
  id: string;
  goalId?: string;
  title: string;
  description?: string;
  dueDate?: Timestamp;
  completed: boolean;
  createdAt: Timestamp;
}

/**
 * Represents a recurring routine or habit.
 * Stored as an array in a user's document.
 */
export interface Routine {
  id: string;
  title: string;
  schedule: "daily" | "weekly" | "monthly" | { custom: string }; // Simple schedule or cron string
  createdAt: Timestamp;
}

/**
 * Represents a message sent from the user to the AI agent.
 * Stored in the /users/{userId}/inbox subcollection.
 */
export interface InboxMessage {
  id: string;
  text: string;
  timestamp: Timestamp | FieldValue;
  status: "pending" | "processing" | "processed" | "error";
  error?: string;
}

/**
 * Represents a message or action sent from the AI agent to the user.
 * Stored in the /users/{userId}/outbox subcollection.
 */
export interface OutboxMessage {
  id: string;
  text: string;
  timestamp: Timestamp | FieldValue;
  // This `action` field is key for making the UI interactive
  action?: {
    type: "start_timer" | "navigate" | "show_notification";
    payload: Record<string, any>;
  };
}

/**
 * Represents user-specific settings.
 * Stored as a map in a user's document.
 */
export interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
  };
} 