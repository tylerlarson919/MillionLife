import { useAuth } from "@/providers/AuthProvider";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
      <div></div>
      <div className="flex items-center">
        <span className="mr-4">{user?.email}</span>
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