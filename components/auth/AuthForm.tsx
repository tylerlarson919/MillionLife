"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SocialButtons } from "./SocialButtons";

interface AuthFormProps {
  mode: "signIn" | "signUp";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let userCredential: UserCredential;
      if (mode === "signUp") {
        console.log("Attempting to sign up user:", email);
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Sign up successful for user:", userCredential.user.uid);
        toast.success("Sign up successful!");
      } else {
        console.log("Attempting to sign in user:", email);
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign in successful for user:", userCredential.user.uid);
        toast.success("Sign in successful!");
      }
      router.push("/dashboard");
    } catch (error: any) {
      console.error(`Error during ${mode}:`, error);
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {mode === "signUp" ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <SocialButtons />
    </div>
  );
}