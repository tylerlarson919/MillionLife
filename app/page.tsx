"use client";

import { useAuth } from "@/context/AuthContext";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/sign-in");
    }
  }, [user, loading, router]);

  // You can return a loading spinner here while redirecting
  return <div>Loading...</div>;
}