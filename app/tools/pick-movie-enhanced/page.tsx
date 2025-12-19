"use client";

import Link from "next/link";

// This tool has been disabled
export default function DisabledTool() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Tool Not Available</h1>
        <p className="text-gray-600 mb-4">
          This tool is no longer available. Please use one of our other movie
          tools instead.
        </p>
        <Link
          href="/tools"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Available Tools
        </Link>
      </div>
    </div>
  );
}
