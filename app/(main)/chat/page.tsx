"use client";

import "regenerator-runtime/runtime";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useChat } from "ai/react";
import {
  Plus,
  Mic,
  Bot,
  X,
  Send,
  Square,
  User,
} from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";

interface UploadedFile {
  file: File;
  previewUrl: string;
}

const suggestionPrompts = [
  "My Goals",
  "Weekly Review",
  "Routine",
];

export default function ChatPage() {
  const { user } = useAuth();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
    append,
    setInput,
  } = useChat({
    api: "/api/gemini",
  });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const { voices, selectedVoice } = useSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechEndTimeout = useRef<any>(null);
  const lastSpokenMessageId = useRef<string | null>(null);
  const lastMessageIsUser =
    messages.length > 0 && messages[messages.length - 1].role !== "user";

  const firstName = user?.displayName?.split(" ")[0] || "there";

  useEffect(() => {
    const synth = window.speechSynthesis;
    // Cleanup on component unmount
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      handleInputChange({ target: { value: transcript } } as any);
    }
  }, [transcript]);

  useEffect(() => {
    if (!listening || !transcript.trim()) {
      if (speechEndTimeout.current) clearTimeout(speechEndTimeout.current);
      return;
    }
    if (speechEndTimeout.current) {
      clearTimeout(speechEndTimeout.current);
    }
    speechEndTimeout.current = setTimeout(() => {
      customHandleSubmit(undefined, transcript);
    }, 3000); // Auto-submit after 3s of silence
  }, [transcript, listening]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      !isLoading &&
      lastMessage &&
      lastMessage.role === "assistant" &&
      !isSpeaking &&
      isVoiceMode &&
      lastMessage.id !== lastSpokenMessageId.current
    ) {
      speak(lastMessage.content);
      lastSpokenMessageId.current = lastMessage.id;
    }
  }, [messages, isLoading, isSpeaking, isVoiceMode]);

  useEffect(() => {
    if (isSpeaking) {
      SpeechRecognition.stopListening();
    }
  }, [isSpeaking]);

  const speak = (text: string) => {
    SpeechRecognition.stopListening();
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (isVoiceMode) {
        startListening(false);
      }
    };
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsVoiceMode(false);
  };

  const startListening = (isNewChat = false) => {
    setIsVoiceMode(true);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (isNewChat) {
      lastSpokenMessageId.current = null;
      setMessages([
        {
          id: "system-prompt",
          role: "system",
          content:
            "You are a conversational voice assistant. Your responses must be brief and to the point.",
        } as any,
      ]);
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    setIsVoiceMode(false);
    customHandleSubmit();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (uploadedFiles.length + files.length > 10) {
      toast.error("You can only upload a maximum of 10 files.");
      return;
    }

    const newFiles = Array.from(files).filter(file => {
      if (uploadedFiles.some(f => f.file.name === file.name)) {
        toast.error(`You already uploaded a file named ${file.name}`);
        return false;
      }
      return true;
    });

    const fileObjects = newFiles.map(file => ({
      file: file,
      previewUrl: URL.createObjectURL(file),
    }));

    setUploadedFiles(prevFiles => [...prevFiles, ...fileObjects]);
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(f => {
      if (f.file.name === fileName) {
        URL.revokeObjectURL(f.previewUrl); // Clean up memory
        return false;
      }
      return true;
    }));
  };

  const customHandleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>,
    text?: string,
  ) => {
    if (e) {
      e.preventDefault();
      setIsVoiceMode(false);
    }

    if (speechEndTimeout.current) {
      clearTimeout(speechEndTimeout.current);
    }

    if (listening) {
      SpeechRecognition.stopListening();
    }

    const prompt = text || input;

    if (!prompt.trim() && uploadedFiles.length === 0) {
      resetTranscript();
      return;
    }

    append({
      role: "user",
      content: prompt,
      // @ts-ignore
      attachments: uploadedFiles.map((f) => ({
        previewUrl: f.previewUrl,
        name: f.file.name,
      })),
    });

    setUploadedFiles([]); // Clear files after submission
    handleInputChange({ target: { value: "" } } as any); // Clear input
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt + " ");
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex justify-end p-2">
        <button
          onClick={() => {
            stopSpeaking();
            setMessages([]);
            lastSpokenMessageId.current = null;
            resetTranscript();
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md transition duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          New Chat
        </button>
      </div>
      <div className="flex-grow flex flex-col p-4 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="max-w-4xl w-full mx-auto">
            {messages
              .filter((m) => m.role !== "system")
              .map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col my-4 ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex flex-col ${
                      m.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    {/* @ts-ignore */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mb-2 flex flex-col items-end">
                        {/* @ts-ignore */}
                        {m.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="relative group w-64 h-64 mb-2"
                          >
                            <img
                              src={attachment.previewUrl}
                              alt={attachment.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {m.content && (
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          m.role === "user"
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ""
                        }`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {m.content as string}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {isLoading && (
              <div className="flex flex-col items-start my-4">
                <div className="animate-pulse">...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-grow flex justify-center items-center">
            <h1 className="text-2xl text-gray-400">
              Hello, {firstName}
            </h1>
          </div>
        )}
        {error && (
          <div className="text-red-500">
            <h2 className="text-xl font-bold">An Error Occurred</h2>
            <p>{error.message}</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl mx-auto p-4">
        {messages.length === 0 && (
        <div className="flex gap-2 mb-4">
          {suggestionPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSuggestionClick(prompt)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
        )}
        <form onSubmit={customHandleSubmit} className="relative">
          <div className="w-full flex flex-col bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {uploadedFiles.map((f) => (
                  <div key={f.file.name} className="relative group w-16 h-16">
                    <img
                      src={f.previewUrl}
                      alt={f.file.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors flex items-center justify-center rounded-md">
                      <button
                        onClick={() => handleRemoveFile(f.file.name)}
                        className="hidden group-hover:block text-white"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={handleFileClick}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <Plus size={24} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
              </button>
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Ask Gemini..."
                className="flex-grow p-2 bg-transparent focus:outline-none resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    customHandleSubmit(e as any);
                  }
                }}
              />
              <div className="flex items-center space-x-2">
                {isSpeaking ? (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <Square size={20} />
                  </button>
                ) : listening ? (
                  <button
                    type="button"
                    onClick={stopListening}
                    className="p-2 text-white bg-blue-500 rounded-full animate-pulse"
                  >
                    <Mic size={20} />
                  </button>
                ) : input ? (
                  <button
                    type="submit"
                    className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600"
                  >
                    <Send size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      isVoiceMode ? setIsVoiceMode(false) : startListening(true)
                    }
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <Mic size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 