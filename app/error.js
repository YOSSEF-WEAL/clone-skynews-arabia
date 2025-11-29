"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-red-50 p-6 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        عذراً، حدث خطأ ما!
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        نواجه مشكلة في تحميل هذه الصفحة. يرجى المحاولة مرة أخرى لاحقاً.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          حاول مرة أخرى
        </button>
        <Link
          href="/"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
