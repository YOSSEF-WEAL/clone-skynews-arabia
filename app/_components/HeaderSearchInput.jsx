"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderSearchInput() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear input after search
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative bg-white rounded-md">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="peer ps-9"
        placeholder="البحث في محتوي سكاي نيوز العربيه"
        type="search"
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <Search size={16} aria-hidden="true" />
      </div>
    </form>
  );
}
