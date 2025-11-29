"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function MobileMenu({ menuItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setOpenSubMenu(null);
  }, [router]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleSubMenu = (id) => {
    setOpenSubMenu(openSubMenu === id ? null : id);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const extractPath = (url, object, objectId) => {
    try {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname;

      if (object === "category" || pathname.includes("/category/")) {
        const match = pathname.match(/\/category\/([^\/]+)\/?$/);
        if (match) {
          const slug = decodeURIComponent(match[1]);
          return `/categories/${slug}`;
        }
        return `/categories/${objectId}`;
      }

      if (object === "page") {
        const segments = pathname.split("/").filter(Boolean);
        const slug = segments[segments.length - 1];
        return `/${decodeURIComponent(slug)}`;
      }

      return pathname;
    } catch {
      if (typeof url === "string" && url.includes("/category/")) {
        const match = url.match(/\/category\/([^\/]+)\/?$/);
        if (match) {
          const slug = decodeURIComponent(match[1]);
          return `/categories/${slug}`;
        }
      }
      return url;
    }
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 bg-primary rounded-lg text-white hover:bg-white/10 transition-colors "
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col gap-4">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">القائمة</span>
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="peer ps-9 bg-gray-50"
              placeholder="بحث..."
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <Search size={16} aria-hidden="true" />
            </div>
          </form>

          {/* Menu Items */}
          <nav className="flex flex-col gap-2 mt-2">
            {menuItems?.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const itemPath = extractPath(
                item.url,
                item.object,
                item.objectId
              );

              return (
                <div
                  key={item.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  {hasChildren ? (
                    <div>
                      <button
                        onClick={() => toggleSubMenu(item.id)}
                        className="flex items-center justify-between w-full py-3 px-2 text-right font-semibold hover:text-primary transition-colors"
                      >
                        {item.title}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            openSubMenu === item.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openSubMenu === item.id
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="bg-gray-50 rounded-lg mb-2 p-2 flex flex-col gap-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={extractPath(
                                child.url,
                                child.object,
                                child.objectId
                              )}
                              className="block py-2 px-4 text-sm hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={itemPath}
                      className="block py-3 px-2 font-semibold hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
