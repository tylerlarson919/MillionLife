"use client";

import { AuthForm } from "@/components/auth/AuthForm";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <AuthForm mode="signUp" />
      </div>
    </div>
  );
}