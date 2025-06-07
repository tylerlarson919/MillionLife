"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { Timestamp } from "firebase/firestore";
import {
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";
import { Message } from "@/types";
import { v4 as uuidv4 } from "uuid";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import { Plus } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

// Define the expected response type from our callable function
interface AIResponse {
  text: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const { voices, selectedVoice } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastSpokenMessageId = useRef<string | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  // Welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        {
          id: "welcome-message",
          text: `Hello, ${
            user.displayName || "there"
          }! How can I assist you today?`,
          senderId: "ai",
          timestamp: Timestamp.now(),
        },
      ]);
    }
  }, [user, messages.length]);

  // Auto-send on speech end
  useEffect(() => {
    if (!listening && transcript.trim()) {
      handleSendMessage(undefined, transcript);
    }
  }, [listening, transcript]);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    resetTranscript();
    if (isSpeaking) stopSpeaking();
  };
  
  const speak = (text: string, messageId: string) => {
    if (lastSpokenMessageId.current === messageId || !listening) return;
    lastSpokenMessageId.current = messageId;

    SpeechRecognition.stopListening();
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
      SpeechRecognition.startListening({ continuous: true });
    };

    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Speak the latest AI message
  useEffect(() => {
    if (listening && !isSpeaking && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId === 'ai' && lastMessage.id !== lastSpokenMessageId.current) {
        speak(lastMessage.text, lastMessage.id);
      }
    }
  }, [messages, listening, isSpeaking]);


  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) return;
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This is a placeholder for your file handling logic.
    // You would typically upload the file to Firebase Storage and then
    // pass the URL to the AI if it supports image/file inputs.
    const files = event.target.files;
    if (!files || files.length === 0) return;
    console.log("Files selected:", files);
    alert("File uploads are not fully implemented yet.");
  };

  const handleSendMessage = async (
    e?: React.FormEvent<HTMLFormElement>,
    voiceTranscript?: string
  ) => {
    if (e) e.preventDefault();
    const textToSend = voiceTranscript || input;
    if (!textToSend.trim() || !user || isSending) return;

    if (listening) SpeechRecognition.stopListening();
    resetTranscript();

    const functions = getFunctions();
    const aichat = httpsCallable(functions, "aichat");

    const newUserMessage: Message = {
      id: uuidv4(),
      text: textToSend,
      senderId: user.uid,
      timestamp: Timestamp.now(),
    };

    const history = messages
      .filter((msg) => msg.id !== "welcome-message")
      .map((msg) => ({
        role: msg.senderId === "ai" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

    setInput("");
    setIsSending(true);

    setMessages((prev) => [
      ...prev,
      newUserMessage,
      {
        id: "ai-thinking",
        text: "...",
        senderId: "ai",
        timestamp: Timestamp.now(),
      },
    ]);

    try {
      console.log("Calling aichat with:", {
        history,
        newMessage: textToSend,
      });
      const result = (await aichat({
        history,
        newMessage: textToSend,
      })) as HttpsCallableResult<AIResponse>;

      const aiResponse: Message = {
        id: uuidv4(),
        text: result.data.text,
        senderId: "ai",
        timestamp: Timestamp.now(),
      };
      setMessages((prev) => [...prev.slice(0, -1), aiResponse]);
    } catch (error) {
      console.error("Error calling AI function:", error);
      if (error && typeof error === 'object' && 'code' in error) {
        console.error("Firebase Function Error Code:", (error as {code: string}).code);
      }
      if (error && typeof error === 'object' && 'details' in error) {
        console.error("Firebase Function Error Details:", (error as {details: unknown}).details);
      }
      const errorResponse: Message = {
        id: uuidv4(),
        text: "Sorry, I encountered an error. Please try again.",
        senderId: "ai",
        timestamp: Timestamp.now(),
      };
      setMessages((prev) => [...prev.slice(0, -1), errorResponse]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gemini-dark-900">
      <video id="dummy-video-for-extension" style={{display: "none"}} />
      <header className="flex items-center justify-between p-4 border-b dark:border-white/10">
        <h1 className="text-xl font-bold dark:text-white">Million.jl AI</h1>
        <button
          onClick={handleNewChat}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gemini-dark-800 dark:text-gray-200 dark:hover:bg-gemini-dark-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isSending={isSending}
        isListening={listening}
        isSpeaking={isSpeaking}
        handleMicClick={handleMicClick}
        stopSpeaking={stopSpeaking}
        onFileChange={handleFileChange}
      />
    </div>
  );
} 