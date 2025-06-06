import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "../ThemeSwitcher";

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  return (
    <header className="flex justify-end items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
        <span>{user?.email}</span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded-md transition duration-200 hover:bg-red-600 dark:hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}