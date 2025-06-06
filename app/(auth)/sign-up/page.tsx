"use client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage } from "@/app/utils/authErrors";

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, loginWithGoogle } = useAuth();
  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(window.location.search);
      const target = params.get("redirect") ?? "/dashboard";
      router.push(target);
    }
  }, [user, router]);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const handleRegister = async () => {
    if (pw !== pw2) {
      addToast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        color: "danger",
      });
      return;
    }
    try {
      await register(email, pw);
      addToast({ title: "Registration successful", color: "success" });
      router.push("/dashboard");
    } catch (e: any) {
      addToast({
        title: "Registration Failed",
        description: getAuthErrorMessage(e),
        color: "danger",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      addToast({ title: "Log in successful", color: "success" });
      router.push("/dashboard");
    } catch (e: any) {
      addToast({
        title: "Login Failed",
        description: getAuthErrorMessage(e),
        color: "danger",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center flex-grow min-h-[80vh] sm:min-h-[50vh] stagger-fadein">
      <div className="flex flex-col p-4 w-full max-w-md">
        <h1 className="text-2xl mb-4 text-center">Register</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2"
          classNames={{
            inputWrapper:
              "rounded-sm border bg-transparent border-black/30 dark:border-textaccent/30",
          }}
        />
        <Input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mb-4"
          classNames={{
            inputWrapper:
              "rounded-sm border bg-transparent border-black/30 dark:border-textaccent/30",
          }}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          className="mb-4"
          classNames={{
            inputWrapper:
              "rounded-sm border bg-transparent border-black/30 dark:border-textaccent/30",
          }}
        />
        <Button
          onPress={handleRegister}
          className="mb-2 w-full py-2 px-6 border bg-transparent border-black/30 dark:border-textaccent/30 text-center button-grow-subtle rounded-sm"
        >
          Register
        </Button>
        <Button
          onPress={handleGoogleLogin}
          className="mb-2 w-full py-2 px-6 bg-dark1 dark:bg-white button-grow-subtle text-white dark:text-black transition-color duration-300 rounded-sm"
          startContent={
            <img
              src="/google-color.webp"
              alt="Google logo"
              className="w-5 h-5"
            />
          }
        >
          Use Google
        </Button>
        <div className="flex justify-between items-center">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-black/40 dark:text-white/40 hover:text-black hover:dark:text-white transition-color duration-300"
          >
            Forgot password?
          </Link>
          <Link
            href="/login"
            className="text-xs font-medium text-black/40 dark:text-white/40 hover:text-black hover:dark:text-white transition-color duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
