"use client";

import { AuthForm } from "@/components/auth/AuthForm";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <AuthForm mode="signIn" />
      </div>
    </div>
  );
}