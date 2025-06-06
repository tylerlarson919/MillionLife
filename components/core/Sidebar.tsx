import Link from "next/link";

export function Sidebar() {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-5 text-2xl font-bold border-b border-gray-200 dark:border-gray-700">
        MillionLife
      </div>
      <nav className="mt-6 flex-1 px-4">
        <Link
          href="/dashboard"
          className="block py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          href="/goals"
          className="block py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Goals
        </Link>
        <Link
          href="/routine"
          className="block py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Routine
        </Link>
        <Link
          href="/review"
          className="block py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Weekly Review
        </Link>
      </nav>
    </div>
  );
}