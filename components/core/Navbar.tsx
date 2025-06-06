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
    <header className="flex justify-between items-center p-4 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700">
      <div></div>
      <div className="flex items-center">
        <ThemeSwitcher />
        <span className="mr-4 ml-4">{user?.email}</span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}