"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function SocialButtons() {
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      await signInWithPopup(auth, provider);
      toast.success("Sign in successful!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error during Google sign-in:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleGoogleSignIn}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}