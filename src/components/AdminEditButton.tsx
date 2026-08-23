"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";

export default function AdminEditButton({ jobId }: { jobId: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the admin token exists in local storage
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <Link 
      href={`/admin/edit/${jobId}`}
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold z-50 transition hover:scale-105"
    >
      <Edit size={20} />
      <span className="hidden md:inline">Edit Job Data</span>
    </Link>
  );
}
