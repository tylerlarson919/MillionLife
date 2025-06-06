"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/core/Navbar";
import { Sidebar } from "@/components/core/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth(); // Get loading state
  const router = useRouter();

  useEffect(() => {
    // Wait until the initial loading is complete
    if (loading) {
      return;
    }
    // If not loading and there's no user, redirect to sign-in
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  // While loading, or if there is no user, show a loading screen
  // This prevents the redirect loop and a flash of the dashboard content
  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Or a proper loading spinner component
  }

  // If loading is false and user exists, render the protected layout
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}