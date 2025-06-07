import React, { useRef } from "react";
import { Send, Mic, Plus, Square } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  isSending: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  handleMicClick: () => void;
  stopSpeaking: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  isSending,
  isListening,
  isSpeaking,
  handleMicClick,
  stopSpeaking,
  onFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 border-t bg-white dark:border-white/10 dark:bg-gemini-dark-900">
      <div className="w-full bg-gray-100 rounded-2xl p-2 dark:bg-gemini-dark-800">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Plus size={24} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              multiple
              className="hidden"
            />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none dark:text-white"
            placeholder={isListening ? "Listening..." : "Type your message..."}
            disabled={isSending}
          />
          <div className="flex items-center space-x-2">
            {isSpeaking ? (
              <button
                type="button"
                onClick={stopSpeaking}
                className="p-2 rounded-full bg-red-500 text-white"
              >
                <Square size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMicClick}
                className={`p-2 rounded-full ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Mic size={20} />
              </button>
            )}
            <button
              type="submit"
              className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSending || !input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput; 