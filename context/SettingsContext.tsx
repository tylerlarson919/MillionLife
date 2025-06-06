"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SettingsContextType = {
  voices: SpeechSynthesisVoice[];
  setVoices: React.Dispatch<React.SetStateAction<SpeechSynthesisVoice[]>>;
  selectedVoice: string | undefined;
  setSelectedVoice: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>();

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };
    synth.onvoiceschanged = loadVoices;
    loadVoices();
  }, [selectedVoice]);

  return (
    <SettingsContext.Provider
      value={{ voices, setVoices, selectedVoice, setSelectedVoice }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
} 