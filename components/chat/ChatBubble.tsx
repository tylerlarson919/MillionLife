import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Message } from "@/types";

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isUser = message.senderId === user?.uid;
  const messageTimestamp = message.timestamp.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${!isUser ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-md ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gemini-dark-700 dark:text-gray-200"
        }`}
      >
        <p>{message.text}</p>
        <p className="text-xs text-right opacity-70 mt-1">{messageTimestamp}</p>
      </div>
    </div>
  );
};

export default ChatBubble; 