import Link from "next/link";

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">AI Assistant</div>
      <nav className="mt-10">
        <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Dashboard
        </Link>
        <Link href="/goals" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Goals
        </Link>
        <Link href="/routine" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Routine
        </Link>
        <Link href="/review" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Weekly Review
        </Link>
      </nav>
    </div>
  );
}